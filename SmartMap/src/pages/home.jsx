import React from 'react';
import {
  Page,
  Navbar,
  NavTitle,
  NavTitleLarge,
  Link,
  Toolbar,
  Block,
} from 'framework7-react';

import MapComponent from '../components/MapComponent';
  
const initialLocation = [37.7749, -122.4194]; // Example location (San Francisco)
const zoom = 12;

const HomePage = () => (
  <Page name="home">
    {/* Top Navbar */}
    <Navbar large>
      <NavTitle>WebMap</NavTitle>
      <NavTitleLarge>WebMap</NavTitleLarge>
    </Navbar>
        <MapComponent initialLocation={initialLocation} zoom={zoom} />
    {/* Toolbar */}
    <Toolbar bottom>
      <Link>Left Link</Link>
      <Link>Right Link</Link>
    </Toolbar>
    {/* Page content */}
  </Page>
);
export default HomePage;