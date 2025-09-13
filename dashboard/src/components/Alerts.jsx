import React, { useState } from 'react';
import { MapPin, Clock, User, AlertTriangle, Navigation, Wifi, WifiOff, ChevronDown, ChevronRight, 
         CheckCircle, Phone, Ambulance, Shield, MessageSquare, X, Save, Truck, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import { useNotification } from './Notification';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full w-full">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'critical': return 'bg-red-100 text-red-800 border-red-200';
    case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getLocationDisplay = (alert, onLocationClick) => {
  const location = alert.location;
  const metadata = alert.metadata;
  
  if (!location) {
    return (
      <div className="flex items-center text-gray-400 text-sm">
        <WifiOff className="w-4 h-4 mr-1" />
        No location data
      </div>
    );
  }

  const { latitude, longitude } = location;
  const locationSource = metadata?.locationSource || 'unknown';
  
  return (
    <div className="space-y-1">
      <div className="flex items-center text-sm">
        {locationSource === 'live_gps' ? (
          <Navigation className="w-4 h-4 mr-1 text-green-600" />
        ) : (
          <MapPin className="w-4 h-4 mr-1 text-blue-600" />
        )}
        <button
          onClick={() => onLocationClick(alert)}
          className="font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors duration-200 flex items-center group"
          title="Click to view on map"
        >
          {latitude?.toFixed(6)}, {longitude?.toFixed(6)}
          <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </button>
        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
          locationSource === 'live_gps' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {locationSource === 'live_gps' ? '🛰️ Live GPS' : '📍 Stored'}
        </span>
      </div>
      {location.address && (
        <div className="text-sm text-gray-600 ml-5">
          📍 {location.address}
        </div>
      )}
    </div>
  );
};

// Alert Action Component
const AlertActions = ({ alert, onStatusUpdate, onDispatch, onNotesUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [notes, setNotes] = useState(alert.notes || '');
  const [showNotesInput, setShowNotesInput] = useState(false);

  const handleStatusUpdate = async (newStatus) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await onStatusUpdate(alert._id, newStatus, notes);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDispatch = async (serviceType) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await onDispatch(alert._id, serviceType);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await onNotesUpdate(alert._id, notes);
      setShowNotesInput(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const isResolved = alert.status === 'Resolved' || alert.status === 'False_Alarm';

  return (
    <div className="border-t border-gray-100 pt-4 mt-4 space-y-4">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {!isResolved && (
          <>
            {/* Emergency Service Dispatch Buttons */}
            <button
              onClick={() => handleDispatch('police')}
              disabled={isUpdating}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm transition-colors"
            >
              <Shield className="w-4 h-4 mr-2" />
              Dispatch Police
            </button>

            <button
              onClick={() => handleDispatch('ambulance')}
              disabled={isUpdating}
              className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 text-sm transition-colors"
            >
              <Ambulance className="w-4 h-4 mr-2" />
              Dispatch Ambulance
            </button>

            <button
              onClick={() => handleDispatch('fire')}
              disabled={isUpdating}
              className="flex items-center px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 text-sm transition-colors"
            >
              <Truck className="w-4 h-4 mr-2" />
              Dispatch Fire Dept
            </button>

            <button
              onClick={() => handleDispatch('tourist_helpline')}
              disabled={isUpdating}
              className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 text-sm transition-colors"
            >
              <Phone className="w-4 h-4 mr-2" />
              Tourist Helpline
            </button>
          </>
        )}

        {/* Status Update Buttons */}
        {!isResolved && (
          <button
            onClick={() => handleStatusUpdate('Resolved')}
            disabled={isUpdating}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 text-sm transition-colors"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark Resolved
          </button>
        )}

        {alert.status !== 'False_Alarm' && (
          <button
            onClick={() => handleStatusUpdate('False_Alarm')}
            disabled={isUpdating}
            className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 text-sm transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            False Alarm
          </button>
        )}

        {/* Notes Button */}
        <button
          onClick={() => setShowNotesInput(!showNotesInput)}
          className="flex items-center px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm transition-colors"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          {showNotesInput ? 'Cancel' : 'Add Notes'}
        </button>
      </div>

      {/* Notes Input */}
      {showNotesInput && (
        <div className="space-y-2">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this alert..."
            className="w-full p-3 text-gray-700 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveNotes}
              disabled={isUpdating}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Notes
            </button>
          </div>
        </div>
      )}

      {/* Show Emergency Dispatches */}
      {alert.emergencyDispatches && alert.emergencyDispatches.length > 0 && (
        <div className="bg-blue-50 p-3 rounded-md">
          <h4 className="font-medium text-blue-800 mb-2">Emergency Services Dispatched:</h4>
          <div className="space-y-1">
            {alert.emergencyDispatches.map((dispatch, index) => (
              <div key={index} className="text-sm text-blue-700">
                • {dispatch.serviceType.charAt(0).toUpperCase() + dispatch.serviceType.slice(1)} - 
                {new Date(dispatch.dispatchedAt).toLocaleString()}
                {dispatch.notes && ` (${dispatch.notes})`}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Show Notes */}
      {alert.notes && (
        <div className="bg-yellow-50 p-3 rounded-md">
          <h4 className="font-medium text-yellow-800 mb-2">Notes:</h4>
          <p className="text-sm text-yellow-700">{alert.notes}</p>
          {alert.notesUpdatedAt && (
            <p className="text-xs text-yellow-600 mt-2">
              Updated: {new Date(alert.notesUpdatedAt).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default function Alerts({ alerts: initialAlerts, isLoading }) {
  const [alerts, setAlerts] = useState(initialAlerts || []);
  const [expandedAlert, setExpandedAlert] = useState(null);
  const [filter, setFilter] = useState('active'); // all, active, resolved - default to active
  const { showNotification, NotificationContainer } = useNotification();
  const navigate = useNavigate();

  // Update local state when props change
  React.useEffect(() => {
    setAlerts(initialAlerts || []);
  }, [initialAlerts]);

  const handleStatusUpdate = async (alertId, newStatus, notes) => {
    try {
      const response = await apiService.updateAlertStatus(alertId, newStatus, notes);
      
      // Update local state
      setAlerts(prevAlerts => 
        prevAlerts.map(alert => 
          alert._id === alertId ? { ...alert, status: newStatus, notes, resolvedAt: new Date() } : alert
        )
      );

      showNotification(`Alert marked as ${newStatus.toLowerCase()}`, 'success');
    } catch (error) {
      console.error('Error updating alert status:', error);
      showNotification('Error updating alert status. Please try again.', 'error');
    }
  };

  const handleDispatch = async (alertId, serviceType) => {
    try {
      const response = await apiService.dispatchEmergencyServices(alertId, serviceType);
      
      // Update local state
      setAlerts(prevAlerts => 
        prevAlerts.map(alert => 
          alert._id === alertId ? { 
            ...alert, 
            status: 'Acknowledged',
            emergencyDispatches: response.alert.emergencyDispatches || []
          } : alert
        )
      );

      showNotification(`${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} dispatched successfully`, 'success');
    } catch (error) {
      console.error('Error dispatching emergency services:', error);
      showNotification('Error dispatching emergency services. Please try again.', 'error');
    }
  };

  const handleNotesUpdate = async (alertId, notes) => {
    try {
      await apiService.updateAlertNotes(alertId, notes);
      
      // Update local state
      setAlerts(prevAlerts => 
        prevAlerts.map(alert => 
          alert._id === alertId ? { ...alert, notes, notesUpdatedAt: new Date() } : alert
        )
      );

      showNotification('Notes updated successfully', 'success');
    } catch (error) {
      console.error('Error updating notes:', error);
      showNotification('Error updating notes. Please try again.', 'error');
    }
  };

  const handleLocationClick = (alert) => {
    // Navigate to map with alert location
    const { latitude, longitude } = alert.location;
    if (latitude && longitude) {
      // Store the alert location in session storage for the map to use
      sessionStorage.setItem('focusAlert', JSON.stringify({
        id: alert._id,
        latitude: latitude,
        longitude: longitude,
        type: alert.type,
        severity: alert.severity,
        timestamp: alert.timestamp,
        touristName: alert.tourist?.name
      }));
      
      navigate('/dashboard/map');
      showNotification('Opening location on map...', 'info');
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    switch (filter) {
      case 'active':
        return alert.status === 'Active' || alert.status === 'Acknowledged';
      case 'resolved':
        return alert.status === 'Resolved' || alert.status === 'False_Alarm';
      default:
        return true;
    }
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-8">
      <NotificationContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white-800 mb-6">Alert Management Center</h1>
        
        {/* Filter Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Alerts ({alerts.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'active' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Active ({alerts.filter(a => a.status === 'Active' || a.status === 'Acknowledged').length})
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'resolved' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Resolved ({alerts.filter(a => a.status === 'Resolved' || a.status === 'False_Alarm').length})
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No {filter !== 'all' ? filter : ''} alerts found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredAlerts.map(alert => {
              const isExpanded = expandedAlert === alert._id;
              
              return (
                <div key={alert._id} className="transition-colors">
                  {/* Alert Header - Always Visible */}
                  <div 
                    className="p-6 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setExpandedAlert(isExpanded ? null : alert._id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            {isExpanded ? (
                              <ChevronDown className="w-5 h-5 text-gray-400 mr-2" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-400 mr-2" />
                            )}
                          </div>
                          
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(alert.severity)}`}>
                            {alert.type} Alert
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            alert.status === 'Active' ? 'bg-red-100 text-red-800' :
                            alert.status === 'Acknowledged' ? 'bg-yellow-100 text-yellow-800' :
                            alert.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {alert.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <User className="w-4 h-4 mr-2 text-gray-500" />
                              <span className="font-medium text-gray-500">Tourist:</span>
                              <span className="ml-1 text-gray-500">{alert.tourist?.name || 'N/A'}</span>
                            </div>
                            
                            <div className="flex items-center text-sm">
                              <Clock className="w-4 h-4 mr-2 text-gray-500" />
                              <span className="font-medium text-gray-500">Time:</span>
                              <span className="ml-1 text-gray-500">{new Date(alert.timestamp).toLocaleString()}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-sm">
                              <span className="font-medium text-gray-700">Location:</span>
                              <div className="mt-1 text-gray-600">
                                {getLocationDisplay(alert, handleLocationClick)}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {alert.message && !isExpanded && (
                          <div className="bg-gray-50 p-3 rounded text-sm">
                            <span className="font-medium text-gray-700">Message:</span>
                            <p className="mt-1 text-gray-600 truncate">{alert.message}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Section - Actions and Details */}
                  {isExpanded && (
                    <div className="px-6 pb-6">
                      {/* Full Message */}
                      {alert.message && (
                        <div className="bg-gray-50 p-3 rounded text-sm mb-4">
                          <span className="font-medium text-gray-700">Message:</span>
                          <p className="mt-1 text-gray-600">{alert.message}</p>
                        </div>
                      )}

                      {/* Action Buttons and Management */}
                      <AlertActions 
                        alert={alert}
                        onStatusUpdate={handleStatusUpdate}
                        onDispatch={handleDispatch}
                        onNotesUpdate={handleNotesUpdate}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
