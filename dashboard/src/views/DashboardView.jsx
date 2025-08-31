import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardHome from '../components/DashboardHome';
import TouristMap from '../components/TouristMap';
import Alerts from '../components/Alerts';
import Reports from '../components/Reports';
import Statistics from '../components/Statistics';

const API_URL = 'http://localhost:5000/api';

const apiService = {
  getTourists: () => fetch(`${API_URL}/dashboard/tourists`).then(res => res.json()),
  getAlerts: () => fetch(`${API_URL}/dashboard/alerts`).then(res => res.json()),
};

export default function DashboardView() {
  const [currentView, setCurrentView] = useState('DashboardHome');
  const [tourists, setTourists] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [touristsData, alertsData] = await Promise.all([
          apiService.getTourists(),
          apiService.getAlerts()
        ]);
        setTourists(touristsData || []);
        setAlerts(alertsData || []);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Could not connect to the backend. Make sure it's running.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const renderView = () => {
    if (error) {
      return <div className="p-8 text-red-500 bg-red-100 rounded-lg">{error}</div>;
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
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1">{renderView()}</main>
    </div>
  );
}
