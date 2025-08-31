import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Tourist Safety Dashboard</h2>
      <nav>
        <ul>
          <li><Link to="/dashboard">Dashboard Home</Link></li>
          <li><Link to="/dashboard/map">Tourist Map</Link></li>
          <li><Link to="/dashboard/alerts">Alerts</Link></li>
          <li><Link to="/dashboard/statistics">Statistics</Link></li>
          <li><Link to="/dashboard/reports">Reports</Link></li>
        </ul>
      </nav>
    </div>
  );
}