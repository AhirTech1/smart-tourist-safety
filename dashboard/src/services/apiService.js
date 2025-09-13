// This file centralizes all API calls for the dashboard.
// Updated to use environment variable for backend URL
const API_URL = import.meta.env.VITE_API_URL || 'https://sih-2025-471306.el.r.appspot.com/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  try {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return {
      'Content-Type': 'application/json'
    };
  }
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
    // Token expired or invalid, clear auth data but don't redirect
    // Let the AuthContext handle the redirect
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
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

  // Alert management
  updateAlertStatus: (alertId, status, notes = '') => apiCall(`${API_URL}/dashboard/alerts/${alertId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, notes })
  }),

  dispatchEmergencyServices: (alertId, serviceType, priority = 'high', dispatchNotes = '') => 
    apiCall(`${API_URL}/dashboard/alerts/${alertId}/dispatch`, {
      method: 'POST',
      body: JSON.stringify({ serviceType, priority, dispatchNotes })
    }),

  updateAlertNotes: (alertId, notes) => apiCall(`${API_URL}/dashboard/alerts/${alertId}/notes`, {
    method: 'PUT',
    body: JSON.stringify({ notes })
  }),

  // Incident Reports Management
  getIncidents: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`${API_URL}/incidents${query ? `?${query}` : ''}`);
  },

  getIncidentById: (incidentId) => apiCall(`${API_URL}/incidents/${incidentId}`),

  updateIncidentStatus: (incidentId, status, note = '') => apiCall(`${API_URL}/incidents/${incidentId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, note })
  }),

  assignIncident: (incidentId, assignedTo) => apiCall(`${API_URL}/incidents/${incidentId}/assign`, {
    method: 'PATCH',
    body: JSON.stringify({ assignedTo })
  }),

  getIncidentStats: () => apiCall(`${API_URL}/incidents/stats`),

  // Get pending incidents count for notification badge
  getPendingIncidentsCount: async () => {
    try {
      const response = await apiCall(`${API_URL}/incidents?status=reported&status=investigating`);
      return response.incidents ? response.incidents.length : 0;
    } catch (error) {
      console.error('Failed to get pending incidents count:', error);
      return 0;
    }
  },
};

export default apiService;
