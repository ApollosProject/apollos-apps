import React from 'react';
import { createBottomTabNavigator } from 'react-navigation';
import { BottomTabBar } from 'react-navigation-tabs';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Connect from './connect';
import Home from './home';
import Discover from './discover';

const mediaPlayerIsVisible = gql`
  query {
    mediaPlayer @client {
      isVisible
    }
  }
`;
const TabBarComponent = (props) => (
  <Query query={mediaPlayerIsVisible}>
    {({ data = {} }) => {
      const overrideProps = {};
      if (data.mediaPlayer && data.mediaPlayer.isVisible) {
        overrideProps.safeAreaInset = { bottom: 'never', top: 'never' };
      }
      console.log({ overrideProps });
      return <BottomTabBar {...props} {...overrideProps} />;
    }}
  </Query>
);

const TabNavigator = createBottomTabNavigator(
  {
    Home,
    Discover,
    Connect,
  },
  {
    tabBarComponent: TabBarComponent,
    tabBarOptions: {
      showLabel: false,
      activeTintColor: '#17B582', // TODO: get from theme
      inactiveTintColor: '#A5A5A5', // TODO: get from theme
      style: {
        backgroundColor: 'white',
      },
    },
  }
);

TabNavigator.navigationOptions = {
  header: null,
};

export default TabNavigator;
