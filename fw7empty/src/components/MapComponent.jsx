// MapComponent.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const MapComponent = ({ zoom }) => {
  const [userPosition, setUserPosition] = useState([0, 0]);

  useEffect(() => {
    // Use Geolocation API to get the user's current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserPosition([latitude, longitude]);
      },
      (error) => {
        console.log(error)
        // TODO set position based on ip address
      }
    );
  }, [])

  const handleUpdatePosition = (newPosition) => {
    setUserPosition(newPosition);
  };

  const customMarkerIcon = new L.Icon({
    iconUrl: '../markerWithServiceHelper/images/marker-icon.png', 
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <div >
      <MapContainer center={userPosition} zoom={zoom} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={userPosition} icon={customMarkerIcon}>
          <Popup>Your Marker Popup</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
