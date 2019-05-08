import React from 'react';
import Config from 'react-native-config';
import Storybook from './storybook';
import MainApp from './App';

const useStorybook = Config.STORYBOOK === 'true';

let App = MainApp;
if (useStorybook) {
  App = Storybook;
}

const RootApp = () => <App />;

export default RootApp;
