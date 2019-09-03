import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { createStackNavigator } from 'react-navigation';
import { withTheme } from '@apollosproject/ui-kit';

import ContentFeed from 'apolloschurchapp/src/content-feed';

import tabBarIcon from '../tabBarIcon';

import Discover from './Discover';

export const DiscoverNavigator = createStackNavigator(
  {
    Discover,
    ContentFeed,
  },
  {
    initialRouteName: 'Discover',
    defaultNavigationOptions: ({ screenProps }) => ({
      headerTintColor: screenProps.headerTintColor,
    }),
  }
);

// const EnhanchedDiscoverNavigator = withTheme(({ theme, ...others }) => ({
// screenProps: { headerTintColor: theme.colors.text.secondary },
// ...others,
// }))(DiscoverNavigator);
const EnhanchedDiscoverNavigator = withTheme(({ theme, ...props }) => (
  <DiscoverNavigator
    {...props}
    screenProps={{ headerTintColor: theme.colors.text.secondary }}
  />
));
hoistNonReactStatic(EnhanchedDiscoverNavigator, DiscoverNavigator);

DiscoverNavigator.navigationOptions = {
  tabBarIcon: tabBarIcon('sections'),
};

export default EnhanchedDiscoverNavigator;
