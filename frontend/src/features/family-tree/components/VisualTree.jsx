import React, { useState, useEffect } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import TreeCard from "./TreeCard";
import api from "../../../services/api";

export default function VisualTree() {
  const [activeRootId, setActiveRootId] = useState(1);
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
    fetchTree(activeRootId);
  }, [activeRootId]);

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

      <div style={{ background: "transparent", overflowX: "auto", width: "100%", display: "flex", justifyContent: "center" }}>
        {loading ? (
          <div style={{ color: "#94a3b8", textAlign: "center", padding: "20px" }}>Loading tree...</div>
        ) : treeData ? (
          <Tree
            lineWidth={"1.5px"}
            lineColor={"#cbd5e1"}
            lineBorderRadius={"8px"}
            nodePadding={"16px"}
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
        ) : (
          <div style={{ color: "#94a3b8", textAlign: "center", padding: "20px" }}>No family members found.</div>
        )}
      </div>
    </div>
  );
}
