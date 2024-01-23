import React, {useState} from 'react';
import {
    Page,
    Navbar,
    NavTitle,
    NavTitleLarge,
    Link,
    Toolbar,
    Block, Input, Button, List, ListItem,
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
const HomePage = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const [suggestedCities, setSuggestedCities] = useState([]);
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
        setSuggestedCities([]);
        cityList.push(searchQuery);
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

    return(
        <Page name="home">
            {/* Top Navbar */}
            <Navbar large slim>
                <NavTitle>WebMap</NavTitle>
                <Input
                    type="text"
                    placeholder="Search..."
                    clearButton
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={{ flex: '1', marginRight: '8px' }}
                />
                <Button fill onClick={handleSearchConfirm}>
                    Confirm
                </Button>
                <NavTitleLarge>WebMap</NavTitleLarge>
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
                            <ListItem key={city} title={city} onClick={() => handleCitySelect(city)} />
                        ))}
                    </List>
                </div>
            )}

            {/* Map component */}
            <MapComponent initialLocation={initialLocation} zoom={zoom} />

            {/* Toolbar */}
            <Toolbar bottom>
                <Link>Left Link</Link>
                <Link>Right Link</Link>
            </Toolbar>
        </Page>
    );
};

export default HomePage;