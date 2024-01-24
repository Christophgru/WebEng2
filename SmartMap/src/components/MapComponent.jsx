// MapComponent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const MapComponent = ({ zoom, destinationMarker, initialLocation }) => {
  const [userPosition, setUserPosition] = useState([0, 0]);
  const mapRef = useRef(null);
  const [firstPos, setFirstPos] = useState(0);

  useEffect(() => {

    const handleUpdatePosition = (newPosition) => {
      setUserPosition(newPosition);
    };

    const handleGeolocationSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      const newPosition = [latitude, longitude];

      handleUpdatePosition(newPosition);

      // Center the map on the user's current position. Center Map until 5th position arrives, then just update marker.
      if(firstPos<5){
        console.log(position.coords);
        mapRef.current && mapRef.current.setView(newPosition, zoom);
        setFirstPos(firstPos+1);
      }
    };


    const handleGeolocationError = (error) => {
      console.log(error);
      // TODO: Implement error handling (e.g., show a message to the user)
    };

    // Use Geolocation API to get the user's current position
    navigator.geolocation.getCurrentPosition(
        handleGeolocationSuccess,
        handleGeolocationError
    );
  }, [userPosition, zoom]);


  const customMarkerIcon = new L.Icon({
    iconUrl: 'icons/marker-icon.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });


  return (
    <div >
      <MapContainer ref={mapRef} center={userPosition} zoom={zoom} style={{ height: '100vh', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={userPosition} icon={customMarkerIcon}>
          <Popup>Your Marker Popup</Popup>
        </Marker>
        {destinationMarker && (
            <Marker position={destinationMarker} icon={customMarkerIcon}>
              <Popup>Your Destination Marker Popup</Popup>
            </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
