import React, { useState, useEffect } from 'react';
import DashboardView from './views/DashboardView';
import LoginView from './views/LoginView';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simple session persistence check
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem('authToken', 'fake-jwt-token'); // Store a token
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Clear the token
    setIsAuthenticated(false);
  };


  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  return <DashboardView onLogout={handleLogout} />;
}
