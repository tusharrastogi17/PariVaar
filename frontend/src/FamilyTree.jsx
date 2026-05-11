import React from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import styled from '@emotion/styled';

const StyledNode = styled.div`
  padding: 10px 14px;
  border-radius: 10px;
  display: inline-block;
  border: 1px solid;
  font-family: "Inter", "Segoe UI", "Arial", sans-serif;
  box-shadow: 0 8px 22px rgba(2, 8, 23, 0.4);
  background: #0f172a;
`;

const Name = styled.div`
  font-weight: 600;
  font-size: 0.98rem;
  margin-bottom: 3px;
  color: #e2e8f0;
`;

const Details = styled.div`
  font-size: 0.78rem;
  color: #94a3b8;
`;

const NodeBox = ({ name, id, gender, spouseName, spouseId, spouseGender }) => {
  const getBorderColor = (g) => (g === "M" ? "#60a5fa" : "#f472b6");
  
  return (
    <div style={{ display: "flex", gap: "10px", justifyContent: "center", alignItems: "center" }}>
      <StyledNode style={{ borderColor: getBorderColor(gender) }}>
        <Name>{name}</Name>
        <Details>ID: {id} • {gender}</Details>
      </StyledNode>
      
      {spouseName && (
        <>
          <div style={{ height: "1px", width: "10px", background: "#475569" }}></div>
          <StyledNode style={{ borderColor: getBorderColor(spouseGender) }}>
            <Name>{spouseName}</Name>
            <Details>ID: {spouseId} • {spouseGender}</Details>
          </StyledNode>
        </>
      )}
    </div>
  );
};

export default function FamilyTree() {
  return (
    <div style={{ padding: "1.5rem", background: "#0f172a", border: "1px solid #2c3d5a", borderRadius: "14px", margin: "0.5rem 0 0", overflowX: "auto" }}>
      <Tree
        lineWidth={"1.5px"}
        lineColor={"#475569"}
        lineBorderRadius={"8px"}
        label={<NodeBox name="Nick" id="1" gender="M" spouseName="Amelia" spouseId="2" spouseGender="F" />}
      >
        <TreeNode label={<NodeBox name="Carrie" id="3" gender="F" spouseName="Williom" spouseId="6" spouseGender="M" />}>
          <TreeNode label={<NodeBox name="Emma" id="8" gender="F" />} />
        </TreeNode>
        
        <TreeNode label={<NodeBox name="Carlo" id="4" gender="M" />} />
        
        <TreeNode label={<NodeBox name="Tay" id="5" gender="M" spouseName="Jane" spouseId="7" spouseGender="F" />}>
          <TreeNode label={<NodeBox name="Alex" id="9" gender="M" spouseName="Jane" spouseId="10" spouseGender="F" />} />
        </TreeNode>
      </Tree>
    </div>
  );
}
