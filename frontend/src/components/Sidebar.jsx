import React from 'react';
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  Link as LinkIcon, 
  GitBranch, 
  Search,
  LogOut,
  FileText,
  List
} from 'lucide-react';

export default function Sidebar({ onLogout, onAddPerson, onAddRelationship, onAddNote, onViewNotes, onViewPeople }) {
  const firstName = localStorage.getItem("user_first_name") || "Jane";
  const lastName = localStorage.getItem("user_last_name") || "Doe";
  const email = localStorage.getItem("user_email") || "admin@parivaar.io";
  const initials = ((firstName[0] || "") + (lastName[0] || "")).toUpperCase() || "JD";

  return (
    <aside className="sidebar-new">

      
      <nav className="sidebar-new-nav">
        <div className="nav-group-title">Overview</div>
        <button className="nav-item-new active">
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </button>


        <div className="nav-group-title">Data Management</div>
        <button className="nav-item-new" onClick={onAddPerson}>
          <UserPlus size={18} />
          <span>Add Person</span>
        </button>
        <button className="nav-item-new" onClick={onViewPeople}>
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
          <div className="user-avatar">{initials}</div>
          <div className="user-details">
            <h4>{firstName} {lastName}</h4>
            <p>{email}</p>
          </div>
          <button className="btn-icon" onClick={onLogout} title="Log Out">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
