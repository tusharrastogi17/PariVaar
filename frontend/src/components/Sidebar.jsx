import React from 'react';
import { Network, Home, Users, Search, Link2, LogOut } from 'lucide-react';

export default function Sidebar({ onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Network size={28} />
        <span>FamilyLinks</span>
      </div>
      
      <nav className="sidebar-nav">
        <button className="nav-item active">
          <Home size={20} />
          <span>Dashboard</span>
        </button>
        <button className="nav-item">
          <Users size={20} />
          <span>People</span>
        </button>
        <button className="nav-item">
          <Link2 size={20} />
          <span>Relationships</span>
        </button>
        <button className="nav-item">
          <Network size={20} />
          <span>Family Tree</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item" onClick={onLogout} style={{ padding: 0 }}>
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
