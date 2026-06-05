import React from "react";

export default function TreeCard({ name, id, gender, spouseName, spouseId, spouseGender, isRoot }) {
  const getAvatarInitials = (n) => {
    if (!n) return "";
    const parts = n.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return n.substring(0, 2).toUpperCase();
  };

  const getGenderClass = (g) => {
    if (g === "M") return "male";
    if (g === "F") return "female";
    return "unknown";
  };
  
  return (
    <div className="tree-node-wrapper">
      <div className={`tree-node-card ${getGenderClass(gender)}`}>
        <div className={`node-avatar ${getGenderClass(gender)}`}>
          {getAvatarInitials(name)}
        </div>
        <div className="node-name">{name}</div>
        <div className="node-badge">{isRoot ? "TARGET (ROOT)" : "CHILD"}</div>
      </div>
      
      {spouseName && (
        <>
          <div className="spouse-connector"></div>
          <div className={`tree-node-card ${getGenderClass(spouseGender)}`}>
            <div className={`node-avatar ${getGenderClass(spouseGender)}`}>
              {getAvatarInitials(spouseName)}
            </div>
            <div className="node-name">{spouseName}</div>
            <div className="node-badge">SPOUSE</div>
          </div>
        </>
      )}
    </div>
  );
}
