import { LogBox } from 'react-native';

import StorybookUI, {
  loadApollosStories,
  addApollosProviderDecorator,
  addDecorator,
  configure,
} from '@apollosproject/ui-storybook';
import decorator from './src/decorator';

import { loadStories } from './storybook/storyLoader';
import { enableScreens } from 'react-native-screens';
enableScreens();

// Storybook issue. Might be solved by updating Core to RN 63
LogBox.ignoreLogs(['null is not an object (evaluating \'story.id\')', 'Story with id', 'No permission handler detected.']);

addDecorator(decorator);

configure(() => {
  require('./src/Welcome');
  loadStories();
  loadApollosStories();
}, module);

export default StorybookUI;
