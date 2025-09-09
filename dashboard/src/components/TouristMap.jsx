import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
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

export default function TouristMap({ tourists, alerts }) {
  const [showTourists, setShowTourists] = useState(true);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showHighRisk, setShowHighRisk] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const highRiskZonesRef = useRef();

  const position = [21.1702, 72.8311]; // Default center (Surat, India)

  const refreshHighRiskZones = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="p-8 h-full flex flex-col">
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
        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

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

          {showHighRisk && <HighRiskZones key={refreshKey} />}

        </MapContainer>
      </div>
    </div>
  );
}