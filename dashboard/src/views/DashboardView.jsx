import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DashboardHome from '../components/DashboardHome';
import TouristMap from '../components/TouristMap';
import Alerts from '../components/Alerts';
import Reports from '../components/Reports';
import Statistics from '../components/Statistics';
import apiService from '../services/apiService';

export default function DashboardView({ onLogout }) {
  const [tourists, setTourists] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get current view from URL
  const currentPath = location.pathname.split('/dashboard')[1] || '';
  const currentView = currentPath.substring(1) || 'home';

  useEffect(() => {
    const fetchData = async (isInitialLoad = false) => {
      if (isInitialLoad) {
        setIsLoading(true);
      }
      setError(null);
      try {
        const [touristsData, alertsData] = await Promise.all([
          apiService.getTourists(),
          apiService.getAlerts()
        ]);
        setTourists(touristsData || []);
        setAlerts(alertsData || []);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Could not connect to the backend. Make sure it's running and accessible.");
      } finally {
        if (isInitialLoad) {
          setIsLoading(false);
        }
      }
    };

    fetchData(true); // Initial fetch
    const intervalId = setInterval(fetchData, 10000); // Subsequent fetches
    return () => clearInterval(intervalId);
  }, []);

  const handleNavigation = (view) => {
    navigate(`/dashboard/${view}`);
  };

  const renderContent = () => {
    if (error) {
      return <div className="p-8 text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-200 rounded-lg m-8">{error}</div>;
    }

    return (
      <Routes>
        <Route path="/" element={<DashboardHome tourists={tourists} alerts={alerts} isLoading={isLoading}/>} />
        <Route path="/home" element={<DashboardHome tourists={tourists} alerts={alerts} isLoading={isLoading}/>} />
        <Route path="/map" element={<TouristMap tourists={tourists} alerts={alerts} />} />
        <Route path="/alerts" element={<Alerts alerts={alerts} isLoading={isLoading}/>} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="*" element={<DashboardHome tourists={tourists} alerts={alerts} isLoading={isLoading}/>} />
      </Routes>
    );
  };

  return (
    <div className="flex bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Sidebar currentView={currentView} setCurrentView={handleNavigation} onLogout={onLogout} />
      <main className="flex-1 text-gray-800 dark:text-gray-200">{renderContent()}</main>
    </div>
  );
}