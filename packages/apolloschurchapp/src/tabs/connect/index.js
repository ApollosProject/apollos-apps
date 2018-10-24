import { createStackNavigator } from 'react-navigation';

import UserSettings from 'apolloschurchapp/src/user-settings';

import TestingControlPanel from '../../testing-control-panel';
import tabBarIcon from '../tabBarIcon';
import Connect from './Connect';

const ConnectNavigator = createStackNavigator(
  {
    Connect,
    TestingControlPanel,
    UserSettings,
  },
  {
    initialRouteName: 'Connect',
    headerMode: 'screen',
  }
);

ConnectNavigator.navigationOptions = {
  tabBarIcon: tabBarIcon('profile'),
};

export default ConnectNavigator;
