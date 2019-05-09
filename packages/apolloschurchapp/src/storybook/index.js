import StorybookUI, {
  loadApollosStories,
  addApollosProviderDecorator,
  configure,
} from '@apollosproject/ui-storybook';
import SplashScreen from 'react-native-splash-screen';

import Providers from '../Providers';

addApollosProviderDecorator(Providers);

configure(() => {
  require('./Welcome');
  loadApollosStories();

  SplashScreen.hide();
}, module);

export default StorybookUI;
