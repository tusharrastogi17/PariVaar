import React from 'react';
import { 
  Network, 
  LayoutDashboard, 
  Activity, 
  UserPlus, 
  Users, 
  Link as LinkIcon, 
  GitBranch, 
  Search,
  LogOut,
  FileText,
  List
} from 'lucide-react';

export default function Sidebar({ onLogout, onAddPerson, onAddRelationship, onAddNote, onViewNotes }) {
  return (
    <aside className="sidebar-new">
      <div className="sidebar-new-header">
        <Network size={28} />
        <span>Parivaar.</span>
      </div>
      
      <nav className="sidebar-new-nav">
        <div className="nav-group-title">Overview</div>
        <button className="nav-item-new active">
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </button>
        <button className="nav-item-new">
          <Activity size={18} />
          <span>Activity Logs</span>
        </button>

        <div className="nav-group-title">Data Management</div>
        <button className="nav-item-new" onClick={onAddPerson}>
          <UserPlus size={18} />
          <span>Add Person</span>
        </button>
        <button className="nav-item-new">
          <Users size={18} />
          <span>View People</span>
        </button>
        <button className="nav-item-new" onClick={onAddRelationship}>
          <LinkIcon size={18} />
          <span>Add Relationship</span>
        </button>
        <button className="nav-item-new" onClick={onAddNote}>
          <FileText size={18} />
          <span>Add Note</span>
        </button>
        <button className="nav-item-new" onClick={onViewNotes}>
          <List size={18} />
          <span>View All Notes</span>
        </button>

        <div className="nav-group-title">Analysis</div>
        <button className="nav-item-new">
          <GitBranch size={18} />
          <span>Family Tree</span>
        </button>
        <button className="nav-item-new">
          <Search size={18} />
          <span>Relationship Resolver</span>
        </button>
      </nav>

      <div className="sidebar-new-footer">
        <div className="user-profile">
          <div className="user-avatar">JD</div>
          <div className="user-details">
            <h4>Jane Doe</h4>
            <p>admin@parivaar.io</p>
          </div>
          <button className="btn-icon" onClick={onLogout} title="Log Out">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
