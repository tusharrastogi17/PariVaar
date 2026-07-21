import React, { useState, useEffect } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import TreeCard from "./TreeCard";
import api from "../../api/api";

export default function VisualTree() {
  const [treeData, setTreeData] = useState(null);
  const [allPersons, setAllPersons] = useState([]);
  const [selectedRootId, setSelectedRootId] = useState("");
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

  /* Recursive renderer */
  const renderNode = (node) => {
    if (!node) return null;

    const label = (
      <TreeCard
        name={node.name}
        id={node.id}
        gender={node.gender}
        spouseName={node.spouse}
        spouseId={node.spouseId}
        spouseGender={node.spouseGender}
      />
    );

    if (!node.children || node.children.length === 0) {
      return <TreeNode key={node.id} label={label} />;
    }

    return (
      <TreeNode key={node.id} label={label}>
        {node.children.map((child) => renderNode(child))}
      </TreeNode>
    );
  };

  return (
    <div style={{ width: "100%" }}>
      {error && (
        <div className="error-text">
          {error}
        </div>
      )}

      {allPersons.length > 0 && (
        <div style={{ padding: "10px", textAlign: "center", marginBottom: "20px" }}>
          <label style={{ marginRight: "10px", fontWeight: "600", color: "#334155" }}>Select Root Person: </label>
          <select 
            value={selectedRootId} 
            onChange={(e) => setSelectedRootId(e.target.value)} 
            className="sleek-input" 
            style={{ width: "250px", maxWidth: "100%", display: "inline-block", padding: "8px 12px" }}
          >
            {allPersons.map(p => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
          </select>
        </div>
      )}

      <div 
        style={{ 
          background: "#ffffff", 
          overflow: "auto", 
          width: "100%", 
          minHeight: "600px",
          maxHeight: "85vh",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          boxShadow: "inset 0 2px 4px 0 rgb(0 0 0 / 0.02)"
        }}
      >
        {loading ? (
          <div style={{ color: "#94a3b8", textAlign: "center", padding: "20px" }}>Loading tree...</div>
        ) : treeData ? (
          <div style={{ display: "flex", minWidth: "max-content", padding: "20px" }}>
            <div style={{ flex: "1 1 auto" }}></div>
            <div style={{ flex: "0 0 auto" }}>
              <Tree
                lineWidth={"1.5px"}
                lineColor={"#cbd5e1"}
                lineBorderRadius={"8px"}
                nodePadding={"4px"}
                label={
                  <TreeCard
                    name={treeData.name}
                    id={treeData.id}
                    gender={treeData.gender}
                    spouseName={treeData.spouse}
                    spouseId={treeData.spouseId}
                    spouseGender={treeData.spouseGender}
                    isRoot={true}
                  />
                }
              >
                {treeData.children && treeData.children.map((child) => renderNode(child))}
              </Tree>
            </div>
            <div style={{ flex: "1 1 auto" }}></div>
          </div>
        ) : (
          <div style={{ color: "#94a3b8", textAlign: "center", padding: "20px" }}>
            {error || "No family members found. Add a person to start building your tree."}
          </div>
        )}
      </div>
    </div>
  );
}
