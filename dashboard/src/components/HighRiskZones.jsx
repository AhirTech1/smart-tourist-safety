import React, { useState, useEffect } from 'react';
import { Circle, Popup } from 'react-leaflet';
import apiService from '../services/apiService';

const HighRiskZones = () => {
  const [highRiskZones, setHighRiskZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHighRiskZones = async () => {
      try {
        setLoading(true);
        const zones = await apiService.getHighRiskZones();
        setHighRiskZones(zones);
        setError(null);
      } catch (err) {
        console.error('Error fetching high-risk zones:', err);
        setError(err.message);
        // Fallback to sample data if API fails
        setHighRiskZones([
          { 
            _id: 'fallback1', 
            name: 'Sample High Alert Zone A',
            location: { latitude: 21.175, longitude: 72.835 }, 
            radius: 200, 
            riskType: 'High-Alert',
            description: 'Sample zone (API unavailable)'
          },
          { 
            _id: 'fallback2', 
            name: 'Sample High Alert Zone B',
            location: { latitude: 21.165, longitude: 72.825 }, 
            radius: 150, 
            riskType: 'High-Alert',
            description: 'Sample zone (API unavailable)'
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchHighRiskZones();
  }, []);

  if (loading) {
    return null; // Don't render anything while loading
  }

  return (
    <>
      {highRiskZones.map(zone => (
        <Circle
          key={zone._id || zone.id}
          center={[
            zone.location?.latitude || zone.latitude, 
            zone.location?.longitude || zone.longitude
          ]}
          radius={zone.radius}
          pathOptions={{ 
            color: 'red', 
            fillColor: 'red', 
            fillOpacity: 0.3,
            weight: 2
          }}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg">{zone.name}</h3>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Risk Type:</strong> {zone.riskType || 'High-Alert'}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Radius:</strong> {zone.radius}m
              </p>
              {zone.description && (
                <p className="text-sm text-gray-700">
                  <strong>Description:</strong> {zone.description}
                </p>
              )}
              {error && (
                <p className="text-xs text-red-500 mt-1">
                  Note: Using fallback data due to API error
                </p>
              )}
            </div>
          </Popup>
        </Circle>
      ))}
    </>
  );
};

export default HighRiskZones;