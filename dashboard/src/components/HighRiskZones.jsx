import React from 'react';
import { Circle, Popup } from 'react-leaflet';

const highRiskZones = [
  { id: 1, center: [21.175, 72.835], radius: 200, name: 'High Alert Zone A' },
  { id: 2, center: [21.165, 72.825], radius: 150, name: 'High Alert Zone B' },
];

const HighRiskZones = () => {
  return (
    <>
      {highRiskZones.map(zone => (
        <Circle
          key={zone.id}
          center={zone.center}
          radius={zone.radius}
          pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.2 }}
        >
          <Popup>{zone.name}</Popup>
        </Circle>
      ))}
    </>
  );
};

export default HighRiskZones;