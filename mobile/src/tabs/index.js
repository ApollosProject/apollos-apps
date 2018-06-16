import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import ConnectStack from './connect';
import HomeStack from './home';
import SectionsStack from './sections';

export const TabStack = createMaterialBottomTabNavigator(
  {
    Home: HomeStack,
    Sections: SectionsStack,
    Connect: ConnectStack,
  },
  {
    shifting: true,
    labeled: false,
    activeTintColor: '#17B582', // TODO: get from theme
    inactiveTintColor: '#A5A5A5', // TODO: get from theme
    barStyle: {
      backgroundColor: 'white',
    },
  }
);

TabStack.navigationOptions = {
  header: null,
};
