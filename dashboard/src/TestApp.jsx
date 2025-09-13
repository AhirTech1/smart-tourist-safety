import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import refreshDebugger from './utils/debugger';

// Simple auth hook without complex API calls
const useSimpleAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    refreshDebugger.log('Initializing simple auth');
    
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('authUser');
        
        if (token && user) {
          refreshDebugger.log('Found auth data in localStorage');
          setIsAuthenticated(true);
        } else {
          refreshDebugger.log('No auth data found');
          setIsAuthenticated(false);
        }
      } catch (error) {
        refreshDebugger.log('Error checking auth', { error: error.message });
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    // Small delay to prevent immediate effects
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, []);

  const login = (email, password) => {
    refreshDebugger.log('Simple login attempt', { email });
    localStorage.setItem('authToken', 'test-token');
    localStorage.setItem('authUser', JSON.stringify({ email, role: 'admin' }));
    setIsAuthenticated(true);
  };

  const logout = () => {
    refreshDebugger.log('Logout');
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, isLoading, login, logout };
};

// Simple loading spinner
const SimpleSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
  </div>
);

// Simple login form
const SimpleLogin = () => {
  const { login } = useSimpleAuth();
  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('password');

  const handleSubmit = (e) => {
    e.preventDefault();
    refreshDebugger.log('Login form submitted');
    login(email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Test Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-2 border rounded"
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

// Simple dashboard
const SimpleDashboard = () => {
  const { logout } = useSimpleAuth();
  const location = useLocation();

  useEffect(() => {
    refreshDebugger.log('Dashboard location changed', { pathname: location.pathname });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Simple Dashboard</h1>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
        <p>Current path: {location.pathname}</p>
        <p>This is a simplified version to test for refresh issues.</p>
      </div>
    </div>
  );
};

// Route wrapper components
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSimpleAuth();
  
  refreshDebugger.log('ProtectedRoute render', { isAuthenticated, isLoading });
  
  if (isLoading) {
    return <SimpleSpinner />;
  }
  
  if (!isAuthenticated) {
    refreshDebugger.log('Redirecting to login from protected route');
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSimpleAuth();
  
  refreshDebugger.log('PublicRoute render', { isAuthenticated, isLoading });
  
  if (isLoading) {
    return <SimpleSpinner />;
  }
  
  if (isAuthenticated) {
    refreshDebugger.log('Redirecting to dashboard from public route');
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Main test app
export default function TestApp() {
  useEffect(() => {
    refreshDebugger.log('TestApp mounted');
    
    return () => {
      refreshDebugger.log('TestApp unmounted');
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <SimpleLogin />
            </PublicRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <SimpleDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/" 
          element={<Navigate to="/login" replace />} 
        />
        <Route 
          path="*" 
          element={<Navigate to="/login" replace />} 
        />
      </Routes>
    </Router>
  );
}
