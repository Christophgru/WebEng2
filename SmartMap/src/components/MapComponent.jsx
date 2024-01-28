// MapComponent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { marker } from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { f7, Panel, Navbar, Block } from 'framework7-react';
import axios from 'axios';
import { getWikipediaPageInfo } from '@/pages/home';

const MapComponent = ({ zoom, destinationMarker, initialLocation }) => {
    const popupRef = useRef(null);
    const [userPosition, setUserPosition] = useState([0, 0]);
    const [currentDestination, setCurrentDestination] = useState(null);
    const mapRef = useRef(null);
    const [firstPos, setFirstPos] = useState(0);
    const [destinationInfo, setDestinationInfo] = useState({ title: '', extract: '' });

    const [isWikiInfoOpen, setWikiInfo] = useState(false);

    const openWikiPage = () => {
        setWikiInfo(true);
    };

    const closeWikiInfo = () => {
        setWikiInfo(false);
    };

    useEffect(() => {

        const handleUpdatePosition = (newPosition) => {
            setUserPosition(newPosition);
        };

        const handleGeolocationSuccess = (position) => {
            const { latitude, longitude } = position.coords;
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
                const { country, loc } = ipInfoResponse.data;
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
            const updateMarkersAndPopup = async () => {
                const current = new L.LatLng(userPosition[0], userPosition[1]);
                const target = new L.LatLng(destinationMarker[0], destinationMarker[1]);

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
                    createMarker: function () { return null; },
                })
                    .on('routesfound', function (e) {
                        const routes = e.routes;
                        const summary = routes[0].summary;
                        const distance = summary.totalDistance / 1000;
                        const minutes = Math.round((summary.totalTime % 3600) / 60);

                        console.log(`Total distance: ${distance} km and total time ca: ${minutes} minutes`);
                    }).addTo(mapRef.current);

                routingControl.addTo(mapRef.current);

                try { // Fetch Wikipedia data and wait for it to complete
                    const data = await getWikipediaPageInfo(destinationMarker[0], destinationMarker[1]);


                    if (data !== null) {
                        // Update destination info state
                        setDestinationInfo((prevInfo) => ({
                            ...prevInfo,
                            title: data.title,
                            extract: data.extract,
                        }));
                        new L.Marker(current, { icon: customMarkerIcon })

                            .bindPopup('Your Marker Popup').addTo(mapRef.current);

                        new L.Marker(target, { icon: customMarkerIcon }).on('click', openWikiPage)
                            .addTo(mapRef.current);


                        setCurrentDestination(destinationMarker.toString());

                    } else {
                        // Handle the case when data is null, if needed
                        console.log("Data is null");
                    }

                    // data. title &extract in State variable schreiben
                    //informationen in linkes oder rechtes panel verteilen==> scrollable
                    //information auf Popup über marker kann auch beibehalten werden, muss aber unbedingt auf 4 zeilen
                    // oder so gekürzt werden, um nicht das Format zu sprengen.

                } catch (error) {
                    console.error('Error fetching Wikipedia data:', error);
                }
            };

            updateMarkersAndPopup();

            // Update current destination

            setCurrentDestination(destinationMarker.toString());

        }
    }, [userPosition, destinationMarker]);

    return (
        <div>
            <MapContainer ref={mapRef} center={userPosition} zoom={zoom}
                style={{ height: 'calc(100vh - 56px)', width: '100%', position: 'fixed' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={userPosition} icon={customMarkerIcon}>
                    <Popup></Popup>
                </Marker>
                {destinationMarker && (
                    <Marker position={destinationMarker} icon={customMarkerIcon}>
                        <Popup></Popup>
                    </Marker>
                )}
            </MapContainer>

            <Panel side="left" cover themeDark opened={isWikiInfoOpen} onPanelClosed={closeWikiInfo}  style={{ overflowY: 'scroll' }}>
                    <Navbar title={destinationInfo.title} />
                    <Block>
                        <p>{destinationInfo.extract}</p>
                    </Block>
            </Panel>
        </div>
    );
};

export default MapComponent;

