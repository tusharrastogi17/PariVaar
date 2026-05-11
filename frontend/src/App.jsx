import { useState } from "react";
import FamilyTree from "./FamilyTree";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
console.log("API BASE URL:", import.meta.env.VITE_API_BASE_URL);

export default function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [sourceId, setSourceId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [resolveMessage, setResolveMessage] = useState("");
  const [resolveLoading, setResolveLoading] = useState(false);
  const [resolveError, setResolveError] = useState("");

  const [treePersonId, setTreePersonId] = useState("");
  const [treeMessage, setTreeMessage] = useState("");
  const [treeLoading, setTreeLoading] = useState(false);
  const [treeError, setTreeError] = useState("");

  const callHelloApi = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/hello`);
      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.text();
      setMessage(data);
    } catch {
      setMessage("");
      setError("Error calling backend");
    } finally {
      setLoading(false);
    }
  };

  const callResolveApi = async () => {
    setResolveError("");
    setResolveLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/relationships/resolve?sourceId=${sourceId}&targetId=${targetId}`);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setResolveMessage(JSON.stringify(data, null, 2));
      } else {
        const data = await response.text();
        setResolveMessage(data);
      }
    } catch (err) {
      setResolveMessage("");
      setResolveError(`Error calling backend: ${err.message}`);
    } finally {
      setResolveLoading(false);
    }
  };

  const callTreeApi = async () => {
    setTreeError("");
    setTreeLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/tree/${treePersonId}`);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setTreeMessage(JSON.stringify(data, null, 2));
      } else {
        const data = await response.text();
        setTreeMessage(data);
      }
    } catch (err) {
      setTreeMessage("");
      setTreeError(`Error calling backend: ${err.message}`);
    } finally {
      setTreeLoading(false);
    }
  };



  return (
    <main className="app">
      <div className="page-shell">
        <header className="page-header">
          <h1>PariVaar</h1>
          <p>Family relationship tools in one clean dashboard.</p>
        </header>

      <section className="panel">
        <h2>Visual Family Tree</h2>
        <FamilyTree />
      </section>

      <section className="panel">
        <h2>Resolve Relationship API</h2>
        <div className="form-row">
          <div className="field-group">
            <label>Source ID:</label>
            <input
              className="text-input"
              type="number"
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              placeholder="Source ID"
            />
          </div>
          <div className="field-group">
            <label>Target ID:</label>
            <input
              className="text-input"
              type="number"
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              placeholder="Target ID"
            />
          </div>
          <button className="primary-btn" onClick={callResolveApi} disabled={resolveLoading}>
            {resolveLoading ? "Resolving..." : "Resolve"}
          </button>
        </div>

        <div className="response-wrap">
          <strong>Response:</strong>
          <pre className={`response-box ${resolveError ? "error-text" : ""}`}>
            {resolveError || resolveMessage || "No response yet"}
          </pre>
        </div>
      </section>

      <section className="panel">
        <h2>Family Tree API</h2>
        <div className="form-row">
          <div className="field-group">
            <label>Person ID:</label>
            <input
              className="text-input"
              type="number"
              value={treePersonId}
              onChange={(e) => setTreePersonId(e.target.value)}
              placeholder="Person ID"
            />
          </div>
          <button className="primary-btn" onClick={callTreeApi} disabled={treeLoading}>
            {treeLoading ? "Loading..." : "Get Family Tree"}
          </button>
        </div>

        <div className="response-wrap">
          <strong>Response:</strong>
          <pre className={`response-box ${treeError ? "error-text" : ""}`}>
            {treeError || treeMessage || "No response yet"}
          </pre>
        </div>
      </section>

      <section className="panel hello-compact">
        <h2>Hello API</h2>
        <div className="hello-row">
          <p className={`status-text hello-status ${error ? "error-text" : ""}`}>{error || message || "No response yet"}</p>
          <button className="primary-btn hello-btn" onClick={callHelloApi} disabled={loading}>
            {loading ? "Loading..." : "Hello"}
          </button>
        </div>
      </section>
      </div>
    </main>
  );
}
