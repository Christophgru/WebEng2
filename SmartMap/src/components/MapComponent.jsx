// MapComponent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { f7 } from 'framework7-react';
import axios from 'axios';



const MapComponent = ({zoom, destinationMarker, initialLocation}) => {
    const popupRef = useRef(null);
    const [userPosition, setUserPosition] = useState([0, 0]);
    const [currentDestination, setCurrentDestination] = useState(null);
    const mapRef = useRef(null);
    const [firstPos, setFirstPos] = useState(0);

    useEffect(() => {

      const handleUpdatePosition = (newPosition) => {
        setUserPosition(newPosition);
      };

      const handleGeolocationSuccess = (position) => {
        const {latitude, longitude} = position.coords;
        const newPosition = [latitude, longitude];

        handleUpdatePosition(newPosition);

        // Center the map on the user's current position. Center Map until 5th position arrives, then just update marker.
        if (firstPos < 5) {
          console.log(position.coords);
          mapRef.current && mapRef.current.setView(newPosition, zoom);
          setFirstPos(firstPos + 1);
        }
      };

      const handleGeolocationError = async () => {
        try {
          // Fetch user's country using "ipinfo.io"
          const ipInfoResponse = await axios.get('https://ipinfo.io/json');
          const {country, loc} = ipInfoResponse.data;
          // Extract coordinates from the "loc" string
          const [latitude, longitude] = loc.split(',').map(coord => parseFloat(coord));
          setUserPosition([latitude, longitude])
        } catch (error) {
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
    }, [userPosition, zoom, firstPos]);


    const customMarkerIcon = new L.Icon({
      iconUrl: 'icons/marker-icon.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    useEffect(() => {
      if (mapRef.current && destinationMarker && destinationMarker.toString() !== currentDestination) {
        const current = new L.LatLng(userPosition[0], userPosition[1]);
        const target = new L.LatLng(destinationMarker[0], destinationMarker[1]);
        // Clear existing layers on the map
        // Clear existing layers on the map
        mapRef.current.eachLayer((layer) => {
          if (!(layer instanceof L.TileLayer)) {
            mapRef.current.removeLayer(layer);
          }
        });

        // Add new routing control
        const routingControl = L.Routing.control({
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
            }).addTo(mapRef.current);

        routingControl.addTo(mapRef.current);

        // Add new markers with popups
        new L.Marker(current, {icon: customMarkerIcon})
            .bindPopup('Your Marker Popup')
            .addTo(mapRef.current);

        new L.Marker(target, {icon: customMarkerIcon})
            .bindPopup('Your Destination Marker Popup')
            .addTo(mapRef.current);


        // Update current destination
        // Add new markers with popups
        new L.Marker(current, {icon: customMarkerIcon})
            .bindPopup('Your Marker Popup')
            .addTo(mapRef.current);

        new L.Marker(target, {icon: customMarkerIcon})
            .bindPopup('Your Destination Marker Popup')
            .addTo(mapRef.current);

        setCurrentDestination(destinationMarker.toString());
      }
    }, [userPosition, destinationMarker]);

    return (
        <div>
          <MapContainer ref={mapRef} center={userPosition} zoom={zoom}
                        style={{height: 'calc(100vh - 56px)', width: '100%'}}
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

