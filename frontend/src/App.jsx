import { useState } from "react";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const apiUrl = (path) => `${API_BASE_URL}${path}`;

async function readErrorMessage(response, fallbackMessage) {
  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();

  if (contentType.includes("application/json")) {
    try {
      const data = JSON.parse(text);
      return data.message || data.error || fallbackMessage;
    } catch {
      return fallbackMessage;
    }
  }

  if (text.trim().startsWith("<!doctype") || text.trim().startsWith("<html")) {
    return "API returned HTML instead of API data. Please verify VITE_API_BASE_URL points to your Render backend.";
  }

  return text || fallbackMessage;
}

export default function App() {
  const [sourceId, setSourceId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [helloMessage, setHelloMessage] = useState("Not checked yet");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function checkServer() {
    setError("");
    try {
      const response = await fetch(apiUrl("/hello"));
      if (!response.ok) {
        const message = await readErrorMessage(response, "Failed to call /hello");
        throw new Error(message);
      }

      const text = await response.text();
      if (text.trim().startsWith("<!doctype") || text.trim().startsWith("<html")) {
        throw new Error("Frontend is hitting a web page, not your backend API. Set VITE_API_BASE_URL to your Render backend URL.");
      }

      setHelloMessage(text);
    } catch (err) {
      setError(err.message || "Unknown error");
    }
  }

  async function resolveRelationship() {
    setError("");
    setResult(null);

    if (!sourceId || !targetId) {
      setError("Please enter both Source ID and Target ID.");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        sourceId: sourceId.trim(),
        targetId: targetId.trim()
      });

      const response = await fetch(apiUrl(`/relationships/resolve?${params.toString()}`));
      if (!response.ok) {
        const message = await readErrorMessage(response, "Could not resolve relationship");
        throw new Error(message);
      }

      const contentType = response.headers.get("content-type") || "";
      const text = await response.text();
      if (text.trim().startsWith("<!doctype") || text.trim().startsWith("<html")) {
        throw new Error("API returned HTML instead of JSON. Verify VITE_API_BASE_URL and Firebase deployment env.");
      }

      let data;
      if (contentType.includes("application/json")) {
        data = JSON.parse(text);
      } else {
        throw new Error("Backend response is not JSON for /relationships/resolve.");
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="hero card">
        <h1>PariVaar Dashboard</h1>
        <p>Resolve family relationships with your deployed backend API.</p>
        <div className="meta">
          <span>API Base URL:</span>
          <code>{API_BASE_URL || "Not set (using current domain)"}</code>
        </div>
      </section>

      {error && <div className="alert error">{error}</div>}

      <section className="card">
        <div className="section-header">
          <h2>Backend Health</h2>
          <button onClick={checkServer}>Check /hello</button>
        </div>
        <div className="status-row">
          <span className="label">Status</span>
          <span className="value">{helloMessage}</span>
        </div>
      </section>

      <section className="card">
        <h2>Resolve Relationship</h2>
        <p className="subtext">Enter two person IDs and fetch the relationship path.</p>
        <div className="row">
          <input
            placeholder="Source person ID"
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
          />
          <input
            placeholder="Target person ID"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
          />
        </div>
        <button onClick={resolveRelationship} disabled={loading}>
          {loading ? "Fetching..." : "Get Relationship Data"}
        </button>

        {result && (
          <div className="result">
            <h3>API Response</h3>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </section>

      <section className="card note">
        <h3>If Firebase still cannot reach backend</h3>
        <ul>
          <li>Set `VITE_API_BASE_URL` to your Render backend URL before frontend build.</li>
          <li>Redeploy Firebase after env update.</li>
          <li>Ensure backend CORS allows your Firebase domain.</li>
        </ul>
      </section>
    </main>
  );
}
