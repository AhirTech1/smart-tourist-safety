// This file centralizes all API calls for the dashboard.
// Updated to use environment variable for backend URL
const API_URL = import.meta.env.VITE_API_URL || 'https://sih-2025-471306.el.r.appspot.com/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function for API calls with error handling
const apiCall = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers
    }
  });

  if (response.status === 401) {
    // Token expired or invalid, redirect to login
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    window.location.href = '/login';
    throw new Error('Authentication required');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  return response.json();
};

const apiService = {
  // Admin authentication
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(errorData.message || 'Login failed');
    }

    return response.json();
  },

  // Get current user profile
  getProfile: () => apiCall(`${API_URL}/admin/profile`),

  // Dashboard data
  getTourists: () => apiCall(`${API_URL}/dashboard/tourists`),

  getAlerts: () => apiCall(`${API_URL}/dashboard/alerts`),

  getHighRiskZones: () => apiCall(`${API_URL}/dashboard/high-risk-zones`),

  // Admin management (super_admin only)
  createAdmin: (adminData) => apiCall(`${API_URL}/admin/create`, {
    method: 'POST',
    body: JSON.stringify(adminData)
  }),

  listAdmins: () => apiCall(`${API_URL}/admin/list`),
};

export default apiService;
