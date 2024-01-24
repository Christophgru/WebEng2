// MapComponent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { f7, Popup as F7Popup } from 'framework7-react';
import axios from 'axios';
import { exact } from 'prop-types';



const MapComponent = ({ zoom, destinationMarker, initialLocation }) => {
  const popupRef = useRef(null);
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

      // Center the map on the user's current position
      if (firstPos === 0) {
        console.log(position.coords);
        mapRef.current && mapRef.current.setView(newPosition, zoom);
        setFirstPos(1);
      }
    };

    const handleGeolocationError = async () => {
      try {
        // Fetch user's country using "ipinfo.io"
        const ipInfoResponse = await axios.get('https://ipinfo.io/json');
        const { country, loc } = ipInfoResponse.data;
        // Extract coordinates from the "loc" string
        const [latitude, longitude] = loc.split(',').map(coord => parseFloat(coord));
        setUserPosition([latitude, longitude])
      }
      catch (error) {
        popupRef.current = f7.popup.create({
          content: `
          <div class="popup"><div class="block">
          An error occured
          </div></div>
            `,
          on: {
            closed: () => {
              // Clean up the popup when it closes
              popupRef.current = null;
            },
          },
        });

        popupRef.current.open();

        // Close the popup after 2 seconds
        setTimeout(() => {
          popupRef.current.close();
        }, 3000)
      }
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
