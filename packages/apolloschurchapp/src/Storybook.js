import StorybookUI, {
  loadApollosStories,
  storiesOf,
  configure,
} from '@apollosproject/ui-storybook';
import SplashScreen from 'react-native-splash-screen';

import App from './App';

configure(() => {
  loadApollosStories();
  SplashScreen.hide();
}, module);

export default StorybookUI;
