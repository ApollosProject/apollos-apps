import React from 'react';
import { FlatList } from 'react-native';
import { Query } from 'react-apollo';
import { createStackNavigator } from 'react-navigation';

import BackgroundView from 'ui/BackgroundView';
import TileContentFeed from './tileContentFeed';
import tabBarIcon from '../tabBarIcon';
import GET_DISCOVER_ITEMS from './query';

const DiscoverScreen = () => (
  <BackgroundView>
    <Query query={GET_DISCOVER_ITEMS}>
      {({ loading, data: { contentChannels = [] } = {}, refetch }) => (
        <FlatList
          data={contentChannels}
          keyExtractor={(item) => item.id}
          refreshing={loading}
          onRefresh={refetch}
          renderItem={({ item }) => (
            <TileContentFeed
              id={item.id}
              name={item.name}
              content={item.childContentItemsConnection.edges.map(
                (edge) => edge.node
              )}
            />
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
