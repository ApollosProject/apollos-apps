import React from 'react';
import { withProps } from 'recompose';
import { Query } from '@apollo/client/react/components';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { FeedView } from '@apollosproject/ui-kit';

import SearchCardConnected from '../SearchCardConnected';
import GET_SEARCH_RESULTS from './getSearchResults';
import NoResults from './NoResults';
import EmptySearch from './EmptySearch';

import SearchInputHeader from './SearchInputHeader';

// this could be refactored into a custom effect hook 💥
const StyledFeedView = withProps(({ hasContent }) => ({
  contentContainerStyle: {
    ...(hasContent ? {} : { height: '100%' }),
  },
}))(FeedView);

const keyExtractor = (item) => item && get(item, 'node.id', null);

const SearchFeedConnected = ({ searchText, onPressItem, ...props }) => {
  return (
    <Query
      query={GET_SEARCH_RESULTS}
      variables={{ searchText }}
      fetchPolicy="cache-and-network"
    >
      {searchText
        ? ({ loading, error, data, refetch }) => (
            <StyledFeedView
              ListItemComponent={SearchCardConnected}
              content={get(data, 'search.edges', [])}
              ListEmptyComponent={() => <NoResults searchText={searchText} />}
              hasContent={get(data, 'search.edges', []).length}
              isLoading={loading}
              error={error}
              refetch={refetch}
              onPressItem={onPressItem}
              keyExtractor={keyExtractor}
              {...props}
            />
          )
        : // If there is no search content, this will render an empty feed prompting the user to use the search input
          () => <EmptySearch />}
    </Query>
  );
};

SearchFeedConnected.propTypes = {
  searchText: PropTypes.string,
  onPressItem: PropTypes.func,
};

export {
  SearchFeedConnected as default,
  SearchInputHeader,
  NoResults as SearchFeedNoResults,
  GET_SEARCH_RESULTS,
};
