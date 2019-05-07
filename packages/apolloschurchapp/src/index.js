import React from 'react';
import Config from 'react-native-config';
import Providers from './Providers';
import Storybook from './Storybook';
import MainApp from './App';

const useStorybook = Config.STORYBOOK === 'true';

let App = MainApp;
if (useStorybook) {
  App = Storybook;
}

const RootApp = () => (
  <Providers>
    <App />
  </Providers>
);

export default RootApp;
