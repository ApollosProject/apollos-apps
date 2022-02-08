import AsyncStorage from '@react-native-community/async-storage';
import {
  getStorybookUI,
  configure,
  addDecorator,
} from '@storybook/react-native';

// if you use expo remove this line
// import { AppRegistry } from 'react-native';

import { withKnobs } from '@storybook/addon-knobs';

import { loadApollosStories } from '@apollosproject/ui-storybook';
import decorator from '../src/decorator';

// import './rn-addons';
import { enableScreens } from 'react-native-screens';
enableScreens();

// enables knobs for all stories
// addDecorator(withKnobs);
addDecorator(decorator);

// import stories
configure(() => {
  require('../src/Welcome');
  loadApollosStories();
}, module);

// Refer to https://github.com/storybooks/storybook/tree/master/app/react-native#start-command-parameters
// To find allowed options for getStorybookUI
const StorybookUIRoot = getStorybookUI({
  // Fixes keyboard auto-closing itself when using `react-native-tab-bar`
  shouldDisableKeyboardAvoidingView: true,
  // Default to the UI hidden (what we want in most cases)
  isUIHidden: true,
  asyncStorage: AsyncStorage,
});

export default StorybookUIRoot;
