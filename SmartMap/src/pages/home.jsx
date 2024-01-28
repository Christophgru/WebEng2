//home.jsx
import React, {useState} from 'react';
import {
    Page,
    Navbar,
    Link,
    Toolbar,
     Input, Button, List, ListItem,
} from 'framework7-react';

import MapComponent from '../components/MapComponent';

const initialLocation = [37.7749, -122.4194]; // Example location (San Francisco)
const zoom = 12;
const cityList = [
    'San Francisco',
    'New York',
    'Los Angeles',
    'Chicago'
];


export const getWikipediaPageInfo = async (latitude, longitude) => {
    const apiUrl = 'http://localhost:3001/wikipedia'; // Use your server URL
    const params = new URLSearchParams({
        lat: latitude,
        lon: longitude,
    });

    try {
        const response = await fetch(`${apiUrl}?${params.toString()}`);
        const data = await response.json();

        // Process the Wikipedia API response
        console.log('Wikipedia Data:', data);

        if (data.query && data.query.pages) {
            return {
                title: pageInfo.title,
                extract: pageInfo.extract,
            };
        } else {
            console.log('No Wikipedia page found for the given coordinates.');
            return null;
        }
    } catch (error) {
        console.error('Error fetching Wikipedia data:', error);
        return null;
    }
};

const HomePage = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const [suggestedCities, setSuggestedCities] = useState([]);
    const [destinationMarker, setDestinationMarker] = useState([0, 0]);
    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        // Hier könntest du weitere Aktionen ausführen, z.B. Suchvorgänge starten.
        //hier könnten Vorschläge von einer StädtenamenAPI angezeigt werden
        const matchedCities = cityList.filter((city) =>
            city.toLowerCase().includes(query.toLowerCase())
        );

        setSuggestedCities(matchedCities);
    };


    const handleSearchConfirm = () => {
        // Hier könntest du Aktionen durchführen, wenn der Bestätigungsbutton gedrückt wird.
        console.log('Suche bestätigt:', searchQuery);
        //Vorschläge zurücksetzen, um platz für Karte zu machen
        setSuggestedCities([]);
        cityList.push(searchQuery);

        fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + searchQuery)
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                //console.log("OBJECT: " + JSON.stringify(json));
                //console.log('LAT: ' + json[0].lat);
                console.log("Die Koordinaten der Adresse: " + searchQuery + " sind:");

                console.log("Latitude/Breitengrad: " + json[0].lat);
                console.log("Longitude/Längengrad: " + json[0].lon);
                getWikipediaPageInfo(json[0].lat, json[0].lon)

                //call MapComponent.jsx now and set destinationMarker to [Latitude and Longitude]
                setDestinationMarker([parseFloat(json[0].lat), parseFloat(json[0].lon)]);
                //todo: fly to position of destination and draw route
            })
    };

    const handleCitySelect = (chosenCity) => {
        // Set the selected city in the search query
        setSearchQuery(chosenCity);
        console.log(chosenCity)
        const matchedCities = cityList.filter((city) =>
            city.toLowerCase().includes(chosenCity.toLowerCase())
        );
        console.log(matchedCities)
        setSuggestedCities(matchedCities);
    };

    return (
        <Page name="home">
            {/* Top Navbar */}
            <Navbar>
            <h1 style={{marginLeft: '1%', color: '#48494B'}}>WebMap</h1>
                <Input
                    type="text"
                    placeholder="Search..."
                    clearButton
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={{flex: '1', marginRight: '3%', marginLeft: '3%'}}
                />
                <Button fill onClick={handleSearchConfirm} style={{marginRight: '1%'}}>
                    Confirm
                </Button>
            </Navbar>

            {/* Floating container for suggested cities */}
            {suggestedCities.length > 0 && (
                <div
                    className="floating-container"
                    style={{
                        position: 'absolute',
                        top: '150px', // Adjust the top position based on your design
                        left: '10%', // Centered horizontally with 80% width
                        width: '80%',
                        backgroundColor: '#fff',
                        borderRadius: '15px',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                        zIndex: 1000, // Ensure it's above other elements
                        margin: '0px', // Remove extra space
                    }}
                >
                    {/* List of suggested cities */}
                    <List>
                        {suggestedCities.map((city) => (
                            <ListItem key={city} title={city} onClick={() => handleCitySelect(city)}/>
                        ))}
                    </List>
                </div>
            )}

            {/* Map component */}
            <MapComponent initialLocation={initialLocation} zoom={zoom} destinationMarker={destinationMarker}/>

            {/* Toolbar */}
            <Toolbar bottom>
                <Link></Link>
                <Link href="/impressum/">Impressum</Link>
                <Link></Link>
            </Toolbar>
        </Page>
    );
};

export default HomePage;