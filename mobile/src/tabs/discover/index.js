import React from 'react';
import { Query } from 'react-apollo';
import { createStackNavigator } from 'react-navigation';

import FeedView from 'ui/FeedView';
import BackgroundView from 'ui/BackgroundView';
import TileContentFeed from './tileContentFeed';
import tabBarIcon from '../tabBarIcon';
import GET_DISCOVER_ITEMS from './query';

const DiscoverScreen = () => (
  <BackgroundView>
    <Query query={GET_DISCOVER_ITEMS}>
      {({ loading, data: { contentChannels = [] } = {}, refetch }) => (
        <FeedView
          content={contentChannels}
          refreshing={loading}
          isLoading={loading}
          refetch={refetch}
          renderItem={({ item }) => (
            <TileContentFeed isLoading={loading} key={item.id} {...item} />
          )}
        />
      )}
    </Query>
  </BackgroundView>
);

DiscoverScreen.navigationOptions = {
  title: 'Discover',
};

export const DiscoverStack = createStackNavigator(
  {
    Discover: DiscoverScreen,
  },
  {
    initialRouteName: 'Discover',
  }
);

DiscoverStack.navigationOptions = {
  tabBarIcon: tabBarIcon('sections'),
};

export default DiscoverStack;
