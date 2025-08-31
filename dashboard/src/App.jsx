import React, { useState } from 'react';
import DashboardView from './views/DashboardView';
import LoginView from './views/LoginView';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginView onLogin={setIsLoggedIn} />;
  }

  return <DashboardView />;
}
