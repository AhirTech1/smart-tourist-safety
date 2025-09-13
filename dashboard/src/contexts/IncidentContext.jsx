import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';

const IncidentContext = createContext();

export const useIncident = () => {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error('useIncident must be used within an IncidentProvider');
  }
  return context;
};

export const IncidentProvider = ({ children }) => {
  const [incidents, setIncidents] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    type: '',
    page: 1,
    limit: 20
  });

  // Fetch incidents based on current filters
  const fetchIncidents = async (newFilters = filters) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getIncidents(newFilters);
      setIncidents(response.incidents || []);
      
      // Update pending count when fetching incidents
      await updatePendingCount();
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update pending incidents count
  const updatePendingCount = async () => {
    try {
      const count = await apiService.getPendingIncidentsCount();
      setPendingCount(count);
    } catch (err) {
      console.error('Failed to update pending count:', err);
    }
  };

  // Update incident status
  const updateIncidentStatus = async (incidentId, status, note = '') => {
    try {
      await apiService.updateIncidentStatus(incidentId, status, note);
      
      // Update local state
      setIncidents(prev => prev.map(incident => 
        incident._id === incidentId 
          ? { ...incident, status, updatedAt: new Date().toISOString() }
          : incident
      ));
      
      // Update pending count
      await updatePendingCount();
      
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Assign incident to user
  const assignIncident = async (incidentId, assignedTo) => {
    try {
      await apiService.assignIncident(incidentId, assignedTo);
      
      // Update local state
      setIncidents(prev => prev.map(incident => 
        incident._id === incidentId 
          ? { ...incident, assignedTo }
          : incident
      ));
      
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Apply filters and fetch new data
  const applyFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    fetchIncidents(updatedFilters);
  };

  // Reset filters
  const resetFilters = () => {
    const defaultFilters = {
      status: '',
      priority: '',
      type: '',
      page: 1,
      limit: 20
    };
    setFilters(defaultFilters);
    fetchIncidents(defaultFilters);
  };

  // Refresh incidents
  const refreshIncidents = () => {
    fetchIncidents();
  };

  // Initial load and periodic updates
  useEffect(() => {
    fetchIncidents();
    
    // Update pending count every 30 seconds
    const interval = setInterval(updatePendingCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const value = {
    incidents,
    pendingCount,
    loading,
    error,
    filters,
    fetchIncidents,
    updateIncidentStatus,
    assignIncident,
    applyFilters,
    resetFilters,
    refreshIncidents,
    updatePendingCount
  };

  return (
    <IncidentContext.Provider value={value}>
      {children}
    </IncidentContext.Provider>
  );
};
