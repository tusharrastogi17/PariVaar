import { useState } from "react";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const apiUrl = (path) => `${API_BASE_URL}${path}`;

export default function App() {
  const [sourceId, setSourceId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [helloMessage, setHelloMessage] = useState("Not checked");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function checkServer() {
    setError("");
    try {
      const response = await fetch(apiUrl("/hello"));
      if (!response.ok) {
        throw new Error("Failed to fetch /hello");
      }
      const text = await response.text();
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
        const text = await response.text();
        throw new Error(text || "Could not resolve relationship");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1>PariVaar Minimal Frontend (React)</h1>
        <p>This uses only your existing APIs to read data.</p>
      </div>

      <div className="card">
        <div className="status">Backend status: {helloMessage}</div>
        <button onClick={checkServer}>Check /hello</button>
      </div>

      <div className="card">
        <h3>Resolve Relationship</h3>
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
          {loading ? "Loading..." : "Get Relationship Data"}
        </button>

        {error && <div className="error">{error}</div>}

        {result && (
          <div>
            <h4>API Response</h4>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
