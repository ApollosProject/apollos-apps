import { LogBox } from 'react-native';
import ApollosConfig from '@apollosproject/config';

import StorybookUI, {
  loadApollosStories,
  addApollosProviderDecorator,
  configure,
} from '@apollosproject/ui-storybook';
import Providers from './src/Providers';

import { loadStories } from './storybook/storyLoader';
// Storybook issue. Might be solved by updating Core to RN 63
LogBox.ignoreLogs(['null is not an object (evaluating \'story.id\')']);


addApollosProviderDecorator(Providers);

configure(() => {
  require('./src/Welcome');
  loadStories();
  loadApollosStories();
}, module);

export default StorybookUI;
