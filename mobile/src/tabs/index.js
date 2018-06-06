import { createBottomTabNavigator } from 'react-navigation';
import { ConnectStack } from './connect';
import { HomeStack } from './home';
import { ProfileStack } from './profile';
import { SearchStack } from './search';
import { SectionsStack } from './sections';

export { default as ConnectScreen, ConnectStack } from './connect';
export { default as HomeScreen, HomeStack } from './home';
export { default as ProfileScreen, ProfileStack } from './profile';
export { default as SearchScreen, SearchStack } from './search';
export { default as SectionsScreen, SectionsStack } from './sections';

export const TabStack = createBottomTabNavigator({
  Home: HomeStack,
  Sections: SectionsStack,
  Connect: ConnectStack,
  Search: SearchStack,
  Profile: ProfileStack,
});
