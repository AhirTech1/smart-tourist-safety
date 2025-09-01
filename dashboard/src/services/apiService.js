// This file centralizes all API calls for the dashboard.
const API_URL = 'http://localhost:5000/api';

const apiService = {
  // NOTE: Admin login endpoint doesn't exist yet in the backend.
  // This is a placeholder for when it's created. For now, we'll simulate login.
  login: async (email, password) => {
    if (email && password) {
      // Simulate a successful API call
      return Promise.resolve({
        token: 'fake-jwt-token',
        user: { name: 'Admin User', email: email },
      });
    }
    return Promise.reject(new Error('Invalid credentials'));
  },

  getTourists: () => fetch(`${API_URL}/dashboard/tourists`).then(res => {
    if (!res.ok) throw new Error('Failed to fetch tourists');
    return res.json();
  }),

  getAlerts: () => fetch(`${API_URL}/dashboard/alerts`).then(res => {
     if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
  }),

  getHighRiskZones: () => fetch(`${API_URL}/dashboard/high-risk-zones`).then(res => {
    if (!res.ok) throw new Error('Failed to fetch high-risk zones');
    return res.json();
  }),
};

export default apiService;
