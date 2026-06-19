import React, { useState, useEffect } from 'react';
import api from '../../api/api';

export default function JSONTreeViewer() {
  const [rootId, setRootId] = useState(1);
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTree = async (id) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/tree/${id}`);
      setTreeData(response.data);
    } catch (err) {
      console.error("Error fetching family tree:", err);
      setError(err.response?.data?.message || err.message || "Failed to load family tree");
      setTreeData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTree(rootId);
  }, [rootId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="form-row"
        style={{ margin: 0, justifyContent: 'flex-start' }}
      >
        <div className="field-group">
          <label htmlFor="json-tree-id">Person ID:</label>
          <input
            id="json-tree-id"
            className="text-input"
            type="number"
            value={rootId}
            onChange={(e) => setRootId(e.target.value)}
            placeholder="e.g. 1"
            style={{ minWidth: '120px' }}
          />
        </div>
      </form>

      <div style={{
        background: '#0f172a',
        border: '1px solid #2c3d5a',
        padding: '15px',
        borderRadius: '10px',
        overflowX: 'auto',
        minHeight: '80px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        {loading && (
          <p style={{ color: '#94a3b8', margin: 0 }}>Loading tree data...</p>
        )}
        
        {!loading && error && (
          <p className="error-text" style={{ margin: 0 }}>{error}</p>
        )}
        
        {!loading && !error && treeData && (
          <pre style={{ margin: 0, color: '#e2e8f0', fontSize: '0.9rem' }}>
            {JSON.stringify(treeData, null, 2)}
          </pre>
        )}

        {!loading && !error && !treeData && (
          <p style={{ color: '#94a3b8', margin: 0 }}>No tree data available.</p>
        )}
      </div>
    </div>
  );
}
