import React, { useState, useEffect } from 'react';
import api from '../../api/api';

function TreeListNode({ node }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div style={{ marginLeft: '16px', margin: '4px 0', fontFamily: 'Inter, sans-serif' }}>
      <div 
        style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '8px', 
          cursor: hasChildren ? 'pointer' : 'default',
          userSelect: 'none',
          padding: '6px 8px',
          borderRadius: '4px',
          transition: 'background-color 0.2s'
        }}
        className={hasChildren ? "hover-bg-slate" : ""}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {hasChildren ? (
          <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'inline-block', width: '12px' }}>
            {isExpanded ? '▼' : '▶'}
          </span>
        ) : (
          <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#cbd5e1', transform: 'scale(0.4)' }}></span>
        )}
        <span style={{ fontWeight: '500', color: '#0f172a', fontSize: '0.95rem' }}>
          {node.name}
          {node.spouse && (
            <span style={{ color: '#475569', fontWeight: '400' }}>
              {' - '}{node.spouse}
            </span>
          )}
        </span>
      </div>
      {hasChildren && isExpanded && (
        <div style={{ borderLeft: '1px dashed #e2e8f0', marginLeft: '18px', paddingLeft: '8px' }}>
          {node.children.map(child => (
            <TreeListNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function JSONTreeViewer() {
  const [allPersons, setAllPersons] = useState([]);
  const [selectedRootId, setSelectedRootId] = useState("");
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadTree = async () => {
      setLoading(true);
      setError(null);
      setTreeData(null);

      try {
        const personsResponse = await api.get("/persons");
        const persons = personsResponse.data ?? [];

        if (cancelled) return;

        setAllPersons(persons);

        if (persons.length === 0) {
          return;
        }

        const rootId = selectedRootId || persons[0].id;
        if (!selectedRootId) setSelectedRootId(rootId);

        const response = await api.get(`/tree/${rootId}`);
        if (!cancelled) {
          setTreeData(response.data);
        }
      } catch (err) {
        if (cancelled) return;
        console.error("Error loading family tree:", err);
        setError(err.response?.data?.message || err.message || "Failed to load family tree");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadTree();
    return () => {
      cancelled = true;
    };
  }, [selectedRootId]);

  return (
    <div style={{ width: "100%", background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', minHeight: '400px' }}>
      {error && (
        <div className="error-text" style={{ color: '#ef4444', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {allPersons.length > 0 && (
        <div style={{ paddingBottom: "16px", borderBottom: '1px solid #f1f5f9', marginBottom: "20px" }}>
          <label style={{ marginRight: "12px", fontWeight: "600", color: "#334155", fontSize: '0.9rem' }}>Select Root Person: </label>
          <select 
            value={selectedRootId} 
            onChange={(e) => setSelectedRootId(e.target.value)} 
            className="sleek-input" 
            style={{ width: "250px", display: "inline-block", padding: "8px 12px", marginBottom: 0 }}
          >
            {allPersons.map(p => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
          </select>
        </div>
      )}

      {loading ? (
        <div style={{ color: "#94a3b8", padding: "20px" }}>Loading tree list...</div>
      ) : treeData ? (
        <div style={{ padding: '8px' }}>
          <TreeListNode node={treeData} />
        </div>
      ) : (
        <div style={{ color: "#94a3b8", padding: "20px" }}>
          No family members found.
        </div>
      )}
    </div>
  );
}
