import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TouristMap from './TouristMap';
import Alerts from './Alerts';
import Statistics from './Statistics';
import Reports from './Reports';
import DashboardHome from './DashboardHome';

export default function MainContent() {
  return (
    <div className="main-content">
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/map" element={<TouristMap />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </div>
  );
}