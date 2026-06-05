import React from 'react';
import { Search } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="topbar">
      <h1 className="topbar-title">Dashboard</h1>
      <div className="topbar-search">
        <Search size={18} color="#94a3b8" />
        <input type="text" placeholder="Search..." />
      </div>
    </header>
  );
}
