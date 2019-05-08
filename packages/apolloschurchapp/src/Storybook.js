import React from 'react';
import StorybookUI, {
  loadApollosStories,
  addApollosProviderDecorator,
  storiesOf,
  configure,
} from '@apollosproject/ui-storybook';
import SplashScreen from 'react-native-splash-screen';

import Providers from './Providers';
import App from './App';

addApollosProviderDecorator(Providers);

configure(() => {
  loadApollosStories();
  storiesOf('Welcome', module).add('the App', () => <App />);

  SplashScreen.hide();
}, module);

export default StorybookUI;
