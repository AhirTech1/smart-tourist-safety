import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardHome from '../components/DashboardHome';
import TouristMap from '../components/TouristMap';
import Alerts from '../components/Alerts';
import Reports from '../components/Reports';
import Statistics from '../components/Statistics';
import apiService from '../services/apiService';

export default function DashboardView({ onLogout }) {
  const [currentView, setCurrentView] = useState('DashboardHome');
  const [tourists, setTourists] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
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
        setIsLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000); // Refresh every 10 seconds
    return () => clearInterval(intervalId);
  }, []);

  const renderView = () => {
    if (error) {
      return <div className="p-8 text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-200 rounded-lg m-8">{error}</div>;
    }

    switch(currentView) {
      case 'DashboardHome':
        return <DashboardHome tourists={tourists} alerts={alerts} isLoading={isLoading}/>;
      case 'TouristMap':
        return <TouristMap />;
      case 'Alerts':
        return <Alerts alerts={alerts} isLoading={isLoading}/>;
      case 'Reports':
        return <Reports />;
      case 'Statistics':
        return <Statistics />;
      default:
        return <DashboardHome tourists={tourists} alerts={alerts} isLoading={isLoading}/>;
    }
  }

  return (
    <div className="flex bg-gray-100 dark:bg-gray-900 min-h-screen">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} onLogout={onLogout} />
      <main className="flex-1 text-gray-800 dark:text-gray-200">{renderView()}</main>
    </div>
  );
}
