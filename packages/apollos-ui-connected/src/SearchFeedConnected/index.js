import React from 'react';
import { withProps } from 'recompose';
import { useNavigation } from '@react-navigation/native';
import { Query } from '@apollo/client/react/components';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { FeedView } from '@apollosproject/ui-kit';

import SearchCardConnected from '../SearchCardConnected';
import GET_SEARCH_RESULTS from './getSearchResults';
import NoResults from './NoResults';

import SearchInputHeader from './SearchInputHeader';

// this could be refactored into a custom effect hook 💥
const StyledFeedView = withProps(({ hasContent }) => ({
  contentContainerStyle: {
    ...(hasContent ? {} : { height: '100%' }),
  },
}))(FeedView);

const handleOnPress = ({ navigation, item }) => {
  const id = get(item, 'node.id', null);
  return navigation.navigate('ContentSingle', {
    itemId: id,
    transitionKey: item.transitionKey,
  });
};

const keyExtractor = (item) => item && get(item, 'node.id', null);

const SearchFeedConnected = ({ searchText, ...props }) => {
  const navigation = useNavigation();
  return (
    <Query
      query={GET_SEARCH_RESULTS}
      variables={{ searchText }}
      fetchPolicy="cache-and-network"
    >
      {({ loading, error, data, refetch }) => (
        <StyledFeedView
          ListItemComponent={SearchCardConnected}
          content={get(data, 'search.edges', [])}
          ListEmptyComponent={() => <NoResults searchText={searchText} />}
          hasContent={get(data, 'search.edges', []).length}
          isLoading={loading}
          error={error}
          refetch={refetch}
          onPressItem={(item) => handleOnPress({ navigation, item })}
          keyExtractor={keyExtractor}
          {...props}
        />
      )}
    </Query>
  );
};

SearchFeedConnected.propTypes = {
  searchText: PropTypes.string,
};

export {
  SearchFeedConnected as default,
  SearchInputHeader,
  NoResults as SearchFeedNoResults,
  GET_SEARCH_RESULTS,
};
