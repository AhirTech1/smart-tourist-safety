import React from 'react';
import { MapPin, Clock, User, AlertTriangle, Navigation, Wifi, WifiOff } from 'lucide-react';

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

const getLocationDisplay = (alert) => {
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
        <span className="font-medium">
          {latitude?.toFixed(6)}, {longitude?.toFixed(6)}
        </span>
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

export default function Alerts({ alerts, isLoading }) {
  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Alerts History</h1>
      <div className="bg-white rounded-lg shadow-lg">
        {alerts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No alerts found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {alerts.map(alert => (
              <div key={alert._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(alert.severity)}`}>
                        {alert.type} Alert
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        alert.status === 'Active' ? 'bg-red-100 text-red-800' :
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
                          <div className="mt-1">
                            {getLocationDisplay(alert)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {alert.message && (
                      <div className="bg-gray-50 p-3 rounded text-sm">
                        <span className="font-medium text-gray-700">Message:</span>
                        <p className="mt-1 text-gray-600">{alert.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
