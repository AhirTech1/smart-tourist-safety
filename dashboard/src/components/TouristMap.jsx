import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import HighRiskZones from './HighRiskZones';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import classnames from 'classnames';

// Fix for default icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Component to handle map center changes
const MapController = ({ focusAlert }) => {
  const map = useMap();
  
  useEffect(() => {
    if (focusAlert) {
      map.setView([focusAlert.latitude, focusAlert.longitude], 15);
    }
  }, [focusAlert, map]);
  
  return null;
};

export default function TouristMap({ tourists, alerts }) {
  const [showTourists, setShowTourists] = useState(true);
  const [showAlerts, setShowAlerts] = useState(true); // Show alerts by default when coming from alerts page
  const [showHighRisk, setShowHighRisk] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [focusAlert, setFocusAlert] = useState(null);
  const highRiskZonesRef = useRef();

  const defaultPosition = [21.1702, 72.8311]; // Default center (Surat, India)
  const position = focusAlert ? [focusAlert.latitude, focusAlert.longitude] : defaultPosition;

  // Check for focused alert from session storage
  useEffect(() => {
    const focusAlertData = sessionStorage.getItem('focusAlert');
    if (focusAlertData) {
      try {
        const alert = JSON.parse(focusAlertData);
        setFocusAlert(alert);
        // Clear from session storage after using
        sessionStorage.removeItem('focusAlert');
      } catch (error) {
        console.error('Error parsing focus alert data:', error);
      }
    }
  }, []);

  const refreshHighRiskZones = () => {
    setRefreshKey(prev => prev + 1);
  };

  const clearFocusAlert = () => {
    setFocusAlert(null);
  };

  // Create custom icon for focused alert
  const focusedAlertIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: 'focused-alert-marker animate-bounce'
  });

  return (
    <div className="p-8 h-full flex flex-col">
      {/* Focused Alert Banner */}
      {focusAlert && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Viewing Alert Location: {focusAlert.type} Alert
                </h3>
                <div className="text-sm text-red-600">
                  {focusAlert.touristName && `Tourist: ${focusAlert.touristName} • `}
                  Time: {new Date(focusAlert.timestamp).toLocaleString()} • 
                  Severity: {focusAlert.severity}
                </div>
              </div>
            </div>
            <button
              onClick={clearFocusAlert}
              className="text-red-500 hover:text-red-700 transition-colors"
              title="Clear focus"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Live Tourist Map</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowTourists(!showTourists)}
            className={classnames('px-4 py-2 rounded-lg text-sm font-medium', {
              'bg-blue-500 text-white': showTourists,
              'bg-gray-200 dark:bg-gray-700 dark:text-gray-300': !showTourists,
            })}
          >
            Tourists
          </button>
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className={classnames('px-4 py-2 rounded-lg text-sm font-medium', {
              'bg-red-500 text-white': showAlerts,
              'bg-gray-200 dark:bg-gray-700 dark:text-gray-300': !showAlerts,
            })}
          >
            Alert Markers
          </button>
          <button
            onClick={() => setShowHighRisk(!showHighRisk)}
            className={classnames('px-4 py-2 rounded-lg text-sm font-medium', {
              'bg-red-500 text-white': showHighRisk,
              'bg-gray-200 dark:bg-gray-700 dark:text-gray-300': !showHighRisk,
            })}
          >
            High-Risk Zones
          </button>
          {showHighRisk && (
            <button
              onClick={refreshHighRiskZones}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors"
              title="Refresh high-risk zones data"
            >
              🔄 Refresh Zones
            </button>
          )}
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md flex-grow">
        <MapContainer center={position} zoom={focusAlert ? 15 : 13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController focusAlert={focusAlert} />

          {showTourists && tourists.map(tourist => (
            (tourist.location && tourist.location.latitude && tourist.location.longitude) &&
            <Marker key={tourist._id} position={[tourist.location.latitude, tourist.location.longitude]}>
              <Popup>
                <b>{tourist.name}</b><br />
                Last seen: {new Date(tourist.lastSeen).toLocaleString()}
              </Popup>
            </Marker>
          ))}
          
          {showAlerts && alerts.map((alert, index) => (
            (alert.location && alert.location.latitude && alert.location.longitude) &&
            <CircleMarker 
              key={`alert-${index}`}
              center={[alert.location.latitude, alert.location.longitude]}
              radius={8}
              pathOptions={{ 
                color: 'red', 
                fillColor: '#ff4444', 
                fillOpacity: 0.6,
                weight: 2
              }}
            >
              <Popup>
                <b>Alert</b><br />
                Type: {alert.type || 'General Alert'}<br />
                Time: {alert.timestamp ? new Date(alert.timestamp).toLocaleString() : 'Unknown'}
              </Popup>
            </CircleMarker>
          ))}

          {/* Focused Alert Marker (highlighted) */}
          {focusAlert && (
            <Marker 
              position={[focusAlert.latitude, focusAlert.longitude]}
              icon={focusedAlertIcon}
            >
              <Popup>
                <div className="font-bold text-red-600">🚨 FOCUSED ALERT</div>
                <b>Type:</b> {focusAlert.type}<br />
                <b>Severity:</b> {focusAlert.severity}<br />
                {focusAlert.touristName && (
                  <>
                    <b>Tourist:</b> {focusAlert.touristName}<br />
                  </>
                )}
                <b>Time:</b> {new Date(focusAlert.timestamp).toLocaleString()}<br />
                <b>Location:</b> {focusAlert.latitude.toFixed(6)}, {focusAlert.longitude.toFixed(6)}
              </Popup>
            </Marker>
          )}

          {showHighRisk && <HighRiskZones key={refreshKey} />}

        </MapContainer>
      </div>
    </div>
  );
}