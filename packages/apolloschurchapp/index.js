import { AppRegistry, YellowBox } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import App from './src';

global.ErrorUtils.setGlobalHandler(() => SplashScreen.hide());

YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated',
  'Module RCTImageLoader',
]);

AppRegistry.registerComponent('apolloschurchapp', () => App);
