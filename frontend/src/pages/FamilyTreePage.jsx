import React, { useState } from "react";
import VisualTree from "../features/family-tree/components/VisualTree";
import { Network } from "lucide-react";
import api from "../services/api";

export default function FamilyTreePage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [resolveError, setResolveError] = useState("");
  const [resolveLoading, setResolveLoading] = useState(false);
  const [resolveMessage, setResolveMessage] = useState("");
  const [sourceId, setSourceId] = useState("");
  const [targetId, setTargetId] = useState("");

  const [treeError, setTreeError] = useState("");
  const [treeLoading, setTreeLoading] = useState(false);
  const [treeMessage, setTreeMessage] = useState("");
  const [treePersonId, setTreePersonId] = useState("");

  const callHelloApi = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await api.get("/hello");
      setMessage(response.data);
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
      const response = await api.get(`/relationships/resolve?sourceId=${sourceId}&targetId=${targetId}`);
      if (typeof response.data === "object") {
        setResolveMessage(JSON.stringify(response.data, null, 2));
      } else {
        setResolveMessage(response.data);
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
      const response = await api.get(`/tree/${treePersonId}`);
      if (typeof response.data === "object") {
        setTreeMessage(JSON.stringify(response.data, null, 2));
      } else {
        setTreeMessage(response.data);
      }
    } catch (err) {
      setTreeMessage("");
      setTreeError(`Error calling backend: ${err.message}`);
    } finally {
      setTreeLoading(false);
    }
  };

  return (
    <>
      <div className="overview-banner">
        <div>
          <h2>Family Tree Overview</h2>
          <p>Manage, visualize, and map your family heritage effortlessly.</p>
        </div>
        <Network size={120} className="overview-icon" />
      </div>

      <div className="tree-container">
        <VisualTree />
      </div>

      <div className="api-tester-section" style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 16px 0' }}>API Testing Tools</h3>
        
        <section className="tree-node-card" style={{ display: 'block', width: '100%', textAlign: 'left', minWidth: 'auto', padding: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '16px', marginTop: 0 }}>Resolve Relationship API</h2>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Source ID:</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  value={sourceId}
                  onChange={(e) => setSourceId(e.target.value)}
                  placeholder="Source ID"
                  style={{ paddingLeft: '12px' }}
                />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Target ID:</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  placeholder="Target ID"
                  style={{ paddingLeft: '12px' }}
                />
              </div>
            </div>
            <button className="btn-primary" onClick={callResolveApi} disabled={resolveLoading} style={{ width: 'auto', padding: '10px 20px' }}>
              {resolveLoading ? "Resolving..." : "Resolve"}
            </button>
          </div>

          <div style={{ marginTop: '20px' }}>
            <strong style={{ display: 'block', marginBottom: '8px' }}>Response:</strong>
            <pre style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px', overflowX: 'auto', margin: 0, color: resolveError ? '#ef4444' : '#0f172a' }}>
              {resolveError || resolveMessage || "No response yet"}
            </pre>
          </div>
        </section>

        <section className="tree-node-card" style={{ display: 'block', width: '100%', textAlign: 'left', minWidth: 'auto', padding: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '16px', marginTop: 0 }}>Family Tree API</h2>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Person ID:</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  value={treePersonId}
                  onChange={(e) => setTreePersonId(e.target.value)}
                  placeholder="Person ID"
                  style={{ paddingLeft: '12px' }}
                />
              </div>
            </div>
            <button className="btn-primary" onClick={callTreeApi} disabled={treeLoading} style={{ width: 'auto', padding: '10px 20px' }}>
              {treeLoading ? "Loading..." : "Get Family Tree"}
            </button>
          </div>

          <div style={{ marginTop: '20px' }}>
            <strong style={{ display: 'block', marginBottom: '8px' }}>Response:</strong>
            <pre style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px', overflowX: 'auto', margin: 0, color: treeError ? '#ef4444' : '#0f172a' }}>
              {treeError || treeMessage || "No response yet"}
            </pre>
          </div>
        </section>

        <section className="tree-node-card" style={{ display: 'flex', width: '100%', textAlign: 'left', minWidth: 'auto', padding: '24px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', margin: '0 0 8px 0' }}>Hello API</h2>
            <p style={{ margin: 0, color: error ? '#ef4444' : '#64748b' }}>{error || message || "No response yet"}</p>
          </div>
          <button className="btn-primary" onClick={callHelloApi} disabled={loading} style={{ width: 'auto', padding: '10px 20px' }}>
            {loading ? "Loading..." : "Hello"}
          </button>
        </section>
      </div>
    </>
  );
}
