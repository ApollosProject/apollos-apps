import React, { memo } from 'react';
import { Query } from 'react-apollo';
import { get } from 'lodash';

import { FeedView } from '@apollosproject/ui-kit';

import TileContentFeed from './TileContentFeed';
import GET_CONTENT_CHANNELS from './getContentChannels';

const childContentItemLoadingState = {
  title: '',
  isLoading: true,
};

const feedItemLoadingState = {
  name: '',
  isLoading: true,
};

// eslint-disable-next-line
const renderItem = (isLoading) => ({ item }) => (
  <TileContentFeed
    id={item.id}
    name={item.name}
    content={get(item, 'childContentItemsConnection.edges', []).map(
      (edge) => edge.node
    )}
    isLoading={isLoading}
    loadingStateObject={childContentItemLoadingState}
  />
);

const DiscoverFeed = memo(() => (
  <Query query={GET_CONTENT_CHANNELS} fetchPolicy="cache-and-network">
    {({ error, loading, data: { contentChannels = [] } = {}, refetch }) => (
      <FeedView
        error={error}
        content={contentChannels}
        isLoading={loading && !contentChannels.length}
        refetch={refetch}
        renderItem={renderItem(loading)}
        loadingStateObject={feedItemLoadingState}
        numColumns={1}
      />
    )}
  </Query>
));

DiscoverFeed.displayName = 'DiscoverFeed';

export default DiscoverFeed;
