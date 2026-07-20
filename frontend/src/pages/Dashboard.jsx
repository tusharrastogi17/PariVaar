import React, { useState } from "react";
import VisualTree from "../components/family-tree/VisualTree";
import JSONTreeViewer from "../components/family-tree/JSONTreeViewer";
import { Network } from "lucide-react";

export default function Dashboard() {
  const [viewType, setViewType] = useState("visual"); // "visual" or "json"

  return (
    <div style={{ padding: '10px' }}>
      <div className="dashboard-grid">
        {/* Active Tree Preview */}
        <div className="dashboard-card" style={{ gridColumn: '1 / -1' }}>
          <div className="dashboard-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="dashboard-card-title">
              <Network size={18} color="#6366f1" />
              Active Tree Preview
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setViewType("visual")} 
                className="sleek-btn"
                style={{ 
                  padding: '6px 12px', 
                  fontSize: '0.85rem',
                  backgroundColor: viewType === "visual" ? "#111111" : "#ffffff",
                  color: viewType === "visual" ? "#ffffff" : "#333333",
                  borderColor: viewType === "visual" ? "#111111" : "#eaeaea"
                }}
              >
                Tile View
              </button>
              <button 
                onClick={() => setViewType("json")} 
                className="sleek-btn"
                style={{ 
                  padding: '6px 12px', 
                  fontSize: '0.85rem',
                  backgroundColor: viewType === "json" ? "#111111" : "#ffffff",
                  color: viewType === "json" ? "#ffffff" : "#333333",
                  borderColor: viewType === "json" ? "#111111" : "#eaeaea"
                }}
              >
                Toggle Type View
              </button>
            </div>
          </div>
          <div className="tree-preview-container" style={{ minHeight: '500px', display: 'block', padding: '16px', background: '#fafafa', borderRadius: '8px' }}>
            {viewType === "visual" ? <VisualTree /> : <JSONTreeViewer />}
          </div>
        </div>
      </div>
    </div>
  );
}
