import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import refreshDebugger from './utils/debugger';
import './index.css';

// Add some debugging
refreshDebugger.log('App starting...', {
  NODE_ENV: import.meta.env.MODE,
  VITE_API_URL: import.meta.env.VITE_API_URL,
  BASE_URL: import.meta.env.BASE_URL
});

// Track reloads without overriding the reload function
let reloadCount = 0;
window.addEventListener('beforeunload', () => {
  reloadCount++;
  refreshDebugger.log('Page reload/navigation detected', { reloadCount });
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
