import React, { useState } from "react";
import VisualTree from "../components/family-tree/VisualTree";
import { useFamilyAPI } from "../hooks/useFamilyAPI";
import { UserPlus, Link as LinkIcon, Network, MessageSquare, X } from "lucide-react";

export default function FamilyTreePage() {
  const [activeModal, setActiveModal] = useState(null); // 'person', 'relationship', 'resolver', 'hello'
  
  // States for person modal
  const [personName, setPersonName] = useState("");
  // States for resolver modal
  const [sourceId, setSourceId] = useState("");
  const [targetId, setTargetId] = useState("");

  const {
    helloState, callHelloApi,
    resolveState, callResolveApi,
  } = useFamilyAPI();

  const handleOpenHello = () => {
    setActiveModal('hello');
    callHelloApi();
  };

  return (
    <div className="dashboard-container">
      {/* Full screen tree */}
      <div className="fullscreen-tree-wrapper">
        <VisualTree />
      </div>

      {/* Floating Action Sidebar */}
      <div className="sleek-sidebar">
        <button className="sleek-btn" onClick={() => setActiveModal('person')}>
          <UserPlus size={18} /> Add / Delete Person
        </button>
        <button className="sleek-btn" onClick={() => setActiveModal('relationship')}>
          <LinkIcon size={18} /> Add Relationship
        </button>
        <button className="sleek-btn" onClick={() => setActiveModal('resolver')}>
          <Network size={18} /> Resolver
        </button>
        <button className="sleek-btn" onClick={handleOpenHello}>
          <MessageSquare size={18} /> Hello API
        </button>
      </div>

      {/* Modals */}
      {activeModal && (
        <div className="sleek-modal-overlay">
          <div className="sleek-modal">
            <button className="close-btn" onClick={() => setActiveModal(null)}><X size={18} /></button>
            
            {activeModal === 'person' && (
              <div className="modal-content">
                <h3>Manage Person</h3>
                <p className="sleek-text">Add or delete a family member.</p>
                <input type="text" className="sleek-input" placeholder="Person Name..." value={personName} onChange={e => setPersonName(e.target.value)} />
                <div className="modal-actions">
                  <button className="sleek-btn primary">Add</button>
                  <button className="sleek-btn danger">Delete</button>
                </div>
              </div>
            )}

            {activeModal === 'relationship' && (
              <div className="modal-content">
                <h3>Add Relationship</h3>
                <p className="sleek-text">Connect two family members.</p>
                <div className="flex-row">
                  <input type="text" className="sleek-input" placeholder="Person 1 ID" />
                  <input type="text" className="sleek-input" placeholder="Person 2 ID" />
                </div>
                <button className="sleek-btn primary full-width">Connect</button>
              </div>
            )}

            {activeModal === 'resolver' && (
              <div className="modal-content">
                <h3>Relationship Resolver</h3>
                <p className="sleek-text">Find the relationship between two members.</p>
                <div className="flex-row">
                  <input type="text" className="sleek-input" placeholder="Source ID" value={sourceId} onChange={e => setSourceId(e.target.value)} />
                  <input type="text" className="sleek-input" placeholder="Target ID" value={targetId} onChange={e => setTargetId(e.target.value)} />
                </div>
                <button className="sleek-btn primary full-width" onClick={() => callResolveApi(sourceId, targetId)}>
                  {resolveState.loading ? 'Resolving...' : 'Resolve'}
                </button>
                <div className="response-box">
                  {resolveState.error || resolveState.message || "Enter IDs to resolve."}
                </div>
              </div>
            )}

            {activeModal === 'hello' && (
              <div className="modal-content">
                <h3>Hello API Test</h3>
                <p className="sleek-text">Pinging backend...</p>
                <div className="response-box">
                  {helloState.loading ? "Loading..." : (helloState.error || helloState.message)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
