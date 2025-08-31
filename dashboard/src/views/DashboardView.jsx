import React from 'react';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainComponent';
import '../styles/main.css';

export default function DashboardView() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <MainContent />
    </div>
  );
}