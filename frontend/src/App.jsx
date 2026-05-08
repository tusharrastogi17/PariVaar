import { useState } from "react";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
console.log("API BASE URL:", import.meta.env.VITE_API_BASE_URL);

export default function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [sourceId, setSourceId] = useState("10");
  const [targetId, setTargetId] = useState("1");
  const [resolveMessage, setResolveMessage] = useState("");
  const [resolveLoading, setResolveLoading] = useState(false);
  const [resolveError, setResolveError] = useState("");

  const [treePersonId, setTreePersonId] = useState("1");
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
    <main className="app" style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <div>
        <h2>Hello API</h2>
        <button onClick={callHelloApi} disabled={loading}>
          {loading ? "Loading..." : "Hello"}
        </button>
        <p>{error || message}</p>
      </div>

      <hr style={{ margin: '2rem 0' }} />

      <div>
        <h2>Resolve Relationship API</h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div>
            <label style={{ marginRight: '0.5rem' }}>Source ID:</label>
            <input
              type="number"
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              placeholder="Source ID"
            />
          </div>
          <div>
            <label style={{ marginRight: '0.5rem' }}>Target ID:</label>
            <input
              type="number"
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              placeholder="Target ID"
            />
          </div>
          <button onClick={callResolveApi} disabled={resolveLoading}>
            {resolveLoading ? "Resolving..." : "Resolve"}
          </button>
        </div>
        
        <div style={{ marginTop: '1rem' }}>
          <strong>Response:</strong>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '1rem', 
            borderRadius: '4px', 
            whiteSpace: 'pre-wrap', 
            wordBreak: 'break-word',
            color: resolveError ? 'red' : 'inherit'
          }}>
            {resolveError || resolveMessage || "No response yet"}
          </pre>
        </div>
      </div>

      <hr style={{ margin: '2rem 0' }} />

      <div>
        <h2>Family Tree API</h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div>
            <label style={{ marginRight: '0.5rem' }}>Person ID:</label>
            <input
              type="number"
              value={treePersonId}
              onChange={(e) => setTreePersonId(e.target.value)}
              placeholder="Person ID"
            />
          </div>
          <button onClick={callTreeApi} disabled={treeLoading}>
            {treeLoading ? "Loading..." : "Get Family Tree"}
          </button>
        </div>
        
        <div style={{ marginTop: '1rem' }}>
          <strong>Response:</strong>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '1rem', 
            borderRadius: '4px', 
            whiteSpace: 'pre-wrap', 
            wordBreak: 'break-word',
            color: treeError ? 'red' : 'inherit'
          }}>
            {treeError || treeMessage || "No response yet"}
          </pre>
        </div>
      </div>
    </main>
  );
}
