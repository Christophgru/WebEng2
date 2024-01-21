import React, { useState, useEffect } from 'react';

import 'leaflet/dist/leaflet.css';

import {
  f7,
  f7ready,
  App,
  View,
} from 'framework7-react';

import MapComponent from './MapComponent';

import routes from '../js/routes';
import store from '../js/store';

const MyApp = () => {


  // Framework7 Parameters
  const f7params = {
    name: 'WebMap',
    theme: 'auto',
    store: store,
    routes: routes,
  };

  f7ready(() => {
    // Call F7 APIs here
  });
  
  const initialLocation = [37.7749, -122.4194]; // Example location (San Francisco)
  const zoom = 12;

  return (
    <App {...f7params}>
      <View main className="" url="/">
      </View>
    </App>
  );
}
export default MyApp;