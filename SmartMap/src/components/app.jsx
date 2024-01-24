import React from 'react';

import '../css/leaflet.css';

import {
  f7ready,
  App,
  View,
} from 'framework7-react';


import routes from '../js/routes';

const MyApp = () => {


  // Framework7 Parameters
  const f7params = {
    name: 'WebMap',
    theme: 'auto',
    routes: routes,
  };

  f7ready(() => {
    // Call F7 APIs here
  });
  


  return (
    <App {...f7params}>
      <View main className="" url="/">
      </View>
    </App>
  );
}
export default MyApp;