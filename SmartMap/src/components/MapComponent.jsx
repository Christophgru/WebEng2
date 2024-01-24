import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

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

      if (firstPos < 5) {
        mapRef.current && mapRef.current.setView(newPosition, zoom);
        setFirstPos(firstPos + 1);
      }
    };

    const handleGeolocationError = (error) => {
      console.log(error);
      // TODO: Implement error handling (e.g., show a message to the user)
    };

    navigator.geolocation.getCurrentPosition(
        handleGeolocationSuccess,
        handleGeolocationError
    );
  }, [userPosition, zoom, firstPos]);

  const customMarkerIcon = new L.Icon({
    iconUrl: 'icons/marker-icon.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  useEffect(() => {
    if (mapRef.current) {
      const current = new L.LatLng(userPosition[0], userPosition[1]);
      const target = new L.LatLng(destinationMarker[0], destinationMarker[1]);

      L.Routing.control({
        waypoints: [current, target],
        show: false,
        fitSelectedRoutes: true,
        plan: false,
        language: 'de',
        routeWhileDragging: true,
        lineOptions: {
          styles: [
            {
              color: 'blue',
              opacity: '0.5',
              weight: 5,
            },
          ],
        },
      })
          .on('routesfound', function (e) {
            const routes = e.routes;
            const summary = routes[0].summary;
            const distance = summary.totalDistance / 1000;
            const minutes = Math.round((summary.totalTime % 3600) / 60);

            console.log(`Total distance: ${distance} km and total time ca: ${minutes} minutes`);
          })
          .addTo(mapRef.current);
    }
  }, [userPosition, destinationMarker]);

  return (
      <div>
        <MapContainer
            ref={mapRef}
            center={userPosition}
            zoom={zoom}
            style={{ height: 'calc(100vh - 56px)', width: '100%' }}
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
