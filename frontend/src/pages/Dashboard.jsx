import React, { useState, useEffect } from "react";
import VisualTree from "../components/family-tree/VisualTree";
import { useFamilyAPI } from "../hooks/useFamilyAPI";
import { Network } from "lucide-react";
import api from "../api/api";

export default function Dashboard() {
  const [sourceId, setSourceId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [peopleList, setPeopleList] = useState([]);
  const { resolveState, callResolveApi } = useFamilyAPI();

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await api.get('/persons');
        setPeopleList(response.data || []);
      } catch (error) {
        console.error("Failed to fetch people for resolver", error);
      }
    };
    fetchPeople();
  }, []);

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
              <select 
                className="sleek-input" 
                value={sourceId} 
                onChange={e => setSourceId(e.target.value)} 
              >
                <option value="">Select Person A...</option>
                {peopleList.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                ))}
              </select>
            </div>
            <div className="resolver-input-group">
              <label>Person B</label>
              <select 
                className="sleek-input" 
                value={targetId} 
                onChange={e => setTargetId(e.target.value)} 
              >
                <option value="">Select Person B...</option>
                {peopleList.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                ))}
              </select>
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
