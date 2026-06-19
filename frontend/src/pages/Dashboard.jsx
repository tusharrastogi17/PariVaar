import React, { useState } from "react";
import VisualTree from "../components/family-tree/VisualTree";
import { useFamilyAPI } from "../hooks/useFamilyAPI";
import { Users, Link as LinkIcon, Network } from "lucide-react";

export default function Dashboard() {
  const [sourceId, setSourceId] = useState("");
  const [targetId, setTargetId] = useState("");
  const { resolveState, callResolveApi } = useFamilyAPI();

  return (
    <div style={{ padding: '32px' }}>
      {/* Welcome Banner */}
      <div className="overview-banner" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' }}>
        <div>
          <h2>Welcome back, Jane! 👋</h2>
          <p>Your family graph engine is running smoothly. You have added 12 new members this month.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-info">
            <h3>Total People</h3>
            <p className="stat-value">142</p>
            <p className="stat-trend positive">↑ 12% vs last month</p>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>
            <Users size={20} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <h3>Relationships</h3>
            <p className="stat-value">315</p>
            <p className="stat-trend positive">↑ 8% vs last month</p>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>
            <LinkIcon size={20} />
          </div>
        </div>
      </div>

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
