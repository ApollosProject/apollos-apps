import { createBottomTabNavigator } from 'react-navigation';
import ConnectStack from './connect';
import HomeStack from './home';
import SectionsStack from './sections';

export const TabStack = createBottomTabNavigator({
  Home: HomeStack,
  Sections: SectionsStack,
  Connect: ConnectStack,
});

TabStack.navigationOptions = {
  header: null,
};
