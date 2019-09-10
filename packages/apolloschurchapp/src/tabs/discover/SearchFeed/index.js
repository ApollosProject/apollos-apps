import React from 'react';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { FeedView } from '@apollosproject/ui-kit';

import ContentCardConnected from '../../../ui/ContentCardConnected';
import fetchMoreResolver from '../../../utils/fetchMoreResolver';

import GET_SEARCH_RESULTS from './getSearchResults';

const handleOnPress = ({ navigation, item }) =>
  navigation.navigate('ContentSingle', {
    itemId: item.id,
    transitionKey: item.transitionKey,
  });

const SearchFeed = ({ navigation, searchValue }) => (
  <Query
    query={GET_SEARCH_RESULTS}
    variables={{ searchQuery: searchValue }}
    fetchPolicy="cache-and-network"
  >
    {({ loading, error, data, refetch, fetchMore, variables }) => (
      <FeedView
        ListItemComponent={ContentCardConnected}
        content={get(data, 'userFeed.edges', []).map((edge) => edge.node)}
        fetchMore={fetchMoreResolver({
          collectionName: 'userFeed', // TODO
          fetchMore,
          variables,
          data,
        })}
        isLoading={loading}
        error={error}
        refetch={refetch}
        onPressItem={handleOnPress({ navigation })}
      />
    )}
  </Query>
);

SearchFeed.propTypes = {
  searchValue: PropTypes.string,
};

export default SearchFeed;
