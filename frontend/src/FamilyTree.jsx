import React from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import styled from '@emotion/styled';

const StyledNode = styled.div`
  padding: 8px 12px;
  border-radius: 8px;
  display: inline-block;
  border: 2px solid;
  font-family: sans-serif;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  background: white;
`;

const Name = styled.div`
  font-weight: bold;
  font-size: 1.1em;
  margin-bottom: 4px;
`;

const Details = styled.div`
  font-size: 0.85em;
  color: #666;
`;

const NodeBox = ({ name, id, gender, spouseName, spouseId, spouseGender }) => {
  const getBorderColor = (g) => g === 'M' ? '#4dabf7' : '#f06595'; // Blue for M, Pink for F
  
  return (
    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center' }}>
      <StyledNode style={{ borderColor: getBorderColor(gender) }}>
        <Name>{name}</Name>
        <Details>ID: {id} • {gender}</Details>
      </StyledNode>
      
      {spouseName && (
        <>
          <div style={{ height: '2px', width: '12px', background: '#ccc' }}></div>
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
    <div style={{ padding: '2rem', background: '#f8f9fa', borderRadius: '8px', margin: '1rem 0', overflowX: 'auto' }}>
      <Tree
        lineWidth={'2px'}
        lineColor={'#ccc'}
        lineBorderRadius={'10px'}
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
