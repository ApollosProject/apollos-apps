import React from 'react';
import { Query } from 'react-apollo';
import { createStackNavigator } from 'react-navigation';
import { get } from 'lodash';

import FeedView from 'ui/FeedView';
import BackgroundView from 'ui/BackgroundView';
import TileContentFeed from './tileContentFeed';
import getContentChannels from './getContentChannels.graphql';
import tabBarIcon from '../tabBarIcon';

const childContentItemLoadingObject = {
  node: {
    isLoading: true,
  },
};

const Discover = () => (
  <BackgroundView>
    <Query query={getContentChannels}>
      {({ error, loading, data: { contentChannels = [] } = {}, refetch }) => (
        <FeedView
          error={error}
          content={contentChannels}
          keyExtractor={(item) => item.id}
          isLoading={loading}
          refetch={refetch}
          renderItem={({ item }) => (
            <TileContentFeed
              id={item.id}
              name={item.name}
              content={get(item, 'childContentItemsConnection.edges', []).map(
                (edge) => edge.node
              )}
            />
          )}
          loadingStateObject={{
            name: '',
            childContentItemsConnection: {
              edges: [
                childContentItemLoadingObject,
                childContentItemLoadingObject,
                childContentItemLoadingObject,
              ],
            },
          }}
        />
      )}
    </Query>
  </BackgroundView>
);

Discover.navigationOptions = {
  title: 'Discover',
};

export const DiscoverNavigator = createStackNavigator(
  {
    Discover,
  },
  {
    initialRouteName: 'Discover',
  }
);

DiscoverNavigator.navigationOptions = {
  tabBarIcon: tabBarIcon('sections'),
};

export default DiscoverNavigator;
