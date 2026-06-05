import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function DashboardLayout({ children, onLogout }) {
  return (
    <div className="dashboard-layout">
      <Sidebar onLogout={onLogout} />
      <div className="main-content-wrapper">
        <Topbar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
