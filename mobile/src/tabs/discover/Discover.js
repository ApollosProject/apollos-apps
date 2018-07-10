import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import { get } from 'lodash';

import FeedView from 'ui/FeedView';
import BackgroundView from 'ui/BackgroundView';

import TileContentFeed from './tileContentFeed';
import getContentChannels from './getContentChannels.graphql';

const childContentItemLoadingObject = {
  node: {
    isLoading: true,
  },
};

class Discover extends PureComponent {
  constructor(props) {
    super(props);

    this.loadingStateObject = {
      name: '',
      childContentItemsConnection: {
        edges: [
          childContentItemLoadingObject,
          childContentItemLoadingObject,
          childContentItemLoadingObject,
        ],
      },
    };
  }

  keyExtractor = (item) => item.id;

  renderItem = ({ item }) => (
    <TileContentFeed
      id={item.id}
      name={item.name}
      content={get(item, 'childContentItemsConnection.edges', []).map(
        (edge) => edge.node
      )}
    />
  );

  render() {
    return (
      <BackgroundView>
        <Query query={getContentChannels}>
          {({
            error,
            loading,
            data: { contentChannels = [] } = {},
            refetch,
          }) => (
            <FeedView
              error={error}
              content={contentChannels}
              keyExtractor={this.keyExtractor}
              isLoading={loading}
              refetch={refetch}
              renderItem={this.renderItem}
              loadingStateObject={this.loadingStateObject}
            />
          )}
        </Query>
      </BackgroundView>
    );
  }
}

Discover.navigationOptions = {
  title: 'Discover',
};

export default Discover;
