import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import refreshDebugger from './utils/debugger';
import './index.css';

// Performance monitoring in development
if (import.meta.env.MODE === 'development') {
  refreshDebugger.log('App starting...', {
    NODE_ENV: import.meta.env.MODE,
    VITE_API_URL: import.meta.env.VITE_API_URL,
    BASE_URL: import.meta.env.BASE_URL
  });

  // Track reloads for debugging
  let reloadCount = 0;
  window.addEventListener('beforeunload', () => {
    reloadCount++;
    refreshDebugger.log('Page reload/navigation detected', { reloadCount });
  });
}

// Render app with error boundary and strict mode for development
ReactDOM.createRoot(document.getElementById('root')).render(
  import.meta.env.MODE === 'development' ? (
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  ) : (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  )
);
