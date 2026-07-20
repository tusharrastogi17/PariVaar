import React, { useState } from "react";
import VisualTree from "../components/family-tree/VisualTree";
import { useFamilyAPI } from "../hooks/useFamilyAPI";
import { Network } from "lucide-react";

export default function Dashboard() {
  const [sourceId, setSourceId] = useState("");
  const [targetId, setTargetId] = useState("");
  const { resolveState, callResolveApi } = useFamilyAPI();

  return (
    <div style={{ padding: '10px' }}>


      <div className="dashboard-grid">
        {/* Active Tree Preview */}
        <div className="dashboard-card" style={{ gridColumn: '1 / -1' }}>
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">
              <Network size={18} color="#6366f1" />
              Active Tree Preview
            </h3>
            <button className="btn-demo" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Expand Full</button>
          </div>
          <div className="tree-preview-container">
            <VisualTree />
          </div>
        </div>

        {/* Relationship Resolver */}
        <div className="dashboard-card" style={{ gridColumn: '1 / -1' }}>
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title">
              <Network size={18} color="#a855f7" />
              Relationship Resolver
            </h3>
          </div>
          <div className="resolver-inputs">
            <div className="resolver-input-group">
              <label>Person A</label>
              <input 
                type="text" 
                className="sleek-input" 
                placeholder="Source ID" 
                value={sourceId} 
                onChange={e => setSourceId(e.target.value)} 
              />
            </div>
            <div className="resolver-input-group">
              <label>Person B</label>
              <input 
                type="text" 
                className="sleek-input" 
                placeholder="Target ID" 
                value={targetId} 
                onChange={e => setTargetId(e.target.value)} 
              />
            </div>
          </div>
          <button 
            className="sleek-btn primary" 
            style={{ width: 'auto', padding: '10px 24px' }}
            onClick={() => callResolveApi(sourceId, targetId)}
          >
            {resolveState.loading ? 'Resolving...' : 'Resolve Relationship'}
          </button>
          
          {(resolveState.message || resolveState.error) && (
            <div className="response-box" style={{ marginTop: '16px' }}>
              {resolveState.error || resolveState.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
