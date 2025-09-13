import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AlertTriangle, X, MapPin, Clock, Phone, Ambulance, Shield, Truck } from 'lucide-react';
import apiService from '../services/apiService';
import { useAudioAlert } from '../hooks/useAudioAlert';
import { useBrowserNotification } from '../hooks/useBrowserNotification';

const AlertContext = createContext();

// Real-time Alert Notification Component
const AlertNotification = ({ alert, onClose, onDispatch, onResolve }) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - new Date(alert.timestamp)) / 1000);
      setTimeElapsed(elapsed);
    }, 1000);

    return () => clearInterval(timer);
  }, [alert.timestamp]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSeverityColor = () => {
    switch (alert.severity) {
      case 'critical': return 'bg-red-600 border-red-700';
      case 'high': return 'bg-orange-600 border-orange-700';
      case 'medium': return 'bg-yellow-600 border-yellow-700';
      default: return 'bg-blue-600 border-blue-700';
    }
  };

  const handleQuickDispatch = (serviceType) => {
    onDispatch(alert._id, serviceType);
  };

  return (
    <div className={`fixed top-4 right-4 z-50 w-96 ${getSeverityColor()} text-white rounded-lg shadow-2xl border-2`}>
      {/* Header */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-6 h-6 text-white" />
            <div>
              <h3 className="font-bold text-lg">🚨 {alert.type.toUpperCase()} ALERT</h3>
              <p className="text-sm opacity-90">Time: {formatTime(timeElapsed)} ago</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Alert Details */}
      <div className="p-4 space-y-3">
        <div className="flex items-center space-x-2 text-sm">
          <span className="font-semibold">Tourist:</span>
          <span>{alert.tourist?.name || 'Unknown'}</span>
        </div>

        {alert.location && (
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="w-4 h-4" />
            <span>
              {alert.location.latitude?.toFixed(4)}, {alert.location.longitude?.toFixed(4)}
            </span>
          </div>
        )}

        {alert.message && (
          <div className="text-sm bg-black/20 p-2 rounded">
            <strong>Message:</strong> {alert.message}
          </div>
        )}

        {/* Quick Action Buttons */}
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wide opacity-90">
            Quick Actions:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDispatch('police')}
              className="flex items-center justify-center px-2 py-2 bg-blue-700 hover:bg-blue-800 rounded text-xs font-medium transition-colors"
            >
              <Shield className="w-3 h-3 mr-1" />
              Police
            </button>
            <button
              onClick={() => handleQuickDispatch('ambulance')}
              className="flex items-center justify-center px-2 py-2 bg-red-700 hover:bg-red-800 rounded text-xs font-medium transition-colors"
            >
              <Ambulance className="w-3 h-3 mr-1" />
              Ambulance
            </button>
            <button
              onClick={() => handleQuickDispatch('fire')}
              className="flex items-center justify-center px-2 py-2 bg-orange-700 hover:bg-orange-800 rounded text-xs font-medium transition-colors"
            >
              <Truck className="w-3 h-3 mr-1" />
              Fire Dept
            </button>
            <button
              onClick={() => handleQuickDispatch('tourist_helpline')}
              className="flex items-center justify-center px-2 py-2 bg-purple-700 hover:bg-purple-800 rounded text-xs font-medium transition-colors"
            >
              <Phone className="w-3 h-3 mr-1" />
              Helpline
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2 border-t border-white/20">
          <button
            onClick={() => onResolve(alert._id)}
            className="flex-1 px-3 py-2 bg-green-700 hover:bg-green-800 rounded text-sm font-medium transition-colors"
          >
            Mark Resolved
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded text-sm font-medium transition-colors"
          >
            {isExpanded ? 'Less' : 'Details'}
          </button>
        </div>

        {/* Expanded Details */}
        {isExpanded && alert.location && (
          <div className="pt-2 border-t border-white/20 text-xs space-y-1">
            <div><strong>Severity:</strong> {alert.severity?.toUpperCase()}</div>
            <div><strong>Risk Score:</strong> {(alert.riskScore * 100).toFixed(1)}%</div>
            {alert.tourist?.phoneNumber && (
              <div><strong>Phone:</strong> {alert.tourist.phoneNumber}</div>
            )}
            <div><strong>Full Location:</strong></div>
            <div className="bg-black/20 p-2 rounded">
              Lat: {alert.location.latitude}<br/>
              Lng: {alert.location.longitude}
              {alert.location.address && <div>Address: {alert.location.address}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const AlertProvider = ({ children }) => {
  const [allAlerts, setAllAlerts] = useState([]);
  const [displayedAlert, setDisplayedAlert] = useState(null);
  const { playAlertSound } = useAudioAlert();
  
  // Count only truly active alerts (not resolved or false alarms)
  const activeAlerts = allAlerts.filter(alert => 
    alert.status === 'Active' || alert.status === 'Acknowledged'
  );
  
  // No browser title changes - keep it simple
  useBrowserNotification(0);

  // Request desktop notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const showDesktopNotification = (alert) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(`🚨 ${alert.type.toUpperCase()} ALERT`, {
        body: `Tourist: ${alert.tourist?.name || 'Unknown'}\nMessage: ${alert.message || 'Emergency assistance needed'}`,
        icon: '/favicon.ico',
        tag: `alert-${alert._id}`, // Prevent duplicate notifications
        requireInteraction: true, // Keep notification until user interacts
        vibrate: [200, 100, 200], // Vibration pattern for mobile
      });

      notification.onclick = () => {
        window.focus(); // Bring window to front
        notification.close();
        setDisplayedAlert(alert); // Show the in-app notification
      };

      // Auto-close desktop notification after 10 seconds
      setTimeout(() => {
        notification.close();
      }, 10000);
    }
  };

  // Poll for new alerts every 5 seconds
  const checkForNewAlerts = useCallback(async () => {
    try {
      const alerts = await apiService.getAlerts();
      
      // Find new critical alerts that weren't in previous fetch
      const previousActiveAlerts = allAlerts.filter(alert => 
        (alert.status === 'Active' || alert.status === 'Acknowledged') &&
        alert.severity === 'critical' &&
        alert.type === 'Panic'
      );
      
      const newCriticalAlerts = alerts.filter(alert => 
        (alert.status === 'Active' || alert.status === 'Acknowledged') &&
        alert.severity === 'critical' &&
        alert.type === 'Panic' &&
        !previousActiveAlerts.find(existing => existing._id === alert._id)
      );

      // Update all alerts
      setAllAlerts(alerts);

      if (newCriticalAlerts.length > 0) {
        // Show the most recent critical alert
        const latestAlert = newCriticalAlerts.sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        )[0];
        
        setDisplayedAlert(latestAlert);

        // Play alert sound for critical notifications
        playAlertSound();

        // Show desktop notification
        showDesktopNotification(latestAlert);

        // Auto-hide after 30 seconds if not manually closed
        setTimeout(() => {
          setDisplayedAlert(null);
        }, 30000);
      }
    } catch (error) {
      console.error('Error checking for new alerts:', error);
    }
  }, [allAlerts]);

  useEffect(() => {
    // Initial check
    checkForNewAlerts();

    // Set up polling
    const interval = setInterval(checkForNewAlerts, 5000);

    return () => clearInterval(interval);
  }, [checkForNewAlerts]);

  const handleDispatchService = async (alertId, serviceType) => {
    try {
      await apiService.dispatchEmergencyServices(alertId, serviceType);
      
      // Update the alert status locally
      setAllAlerts(prev => 
        prev.map(alert => 
          alert._id === alertId ? { ...alert, status: 'Acknowledged' } : alert
        )
      );

      // Show success notification
      console.log(`${serviceType} dispatched for alert ${alertId}`);
    } catch (error) {
      console.error('Error dispatching service:', error);
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      await apiService.updateAlertStatus(alertId, 'Resolved');
      
      // Update alert status and close notification
      setAllAlerts(prev => 
        prev.map(alert => 
          alert._id === alertId ? { ...alert, status: 'Resolved' } : alert
        )
      );
      setDisplayedAlert(null);

      console.log(`Alert ${alertId} marked as resolved`);
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  const handleCloseNotification = () => {
    setDisplayedAlert(null);
  };

  return (
    <AlertContext.Provider value={{
      activeAlerts,
      displayedAlert,
      handleDispatchService,
      handleResolveAlert,
      handleCloseNotification
    }}>
      {children}
      
      {/* Real-time Alert Notification */}
      {displayedAlert && (
        <AlertNotification
          alert={displayedAlert}
          onClose={handleCloseNotification}
          onDispatch={handleDispatchService}
          onResolve={handleResolveAlert}
        />
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within AlertProvider');
  }
  return context;
};

export default AlertContext;
