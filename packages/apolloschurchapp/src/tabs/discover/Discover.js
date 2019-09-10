import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import { throttle, get } from 'lodash';

import { FeedView, BackgroundView } from '@apollosproject/ui-kit';

import SearchInputHeader, {
  ReactNavigationStyleReset,
} from '../../ui/SearchInputHeader';

import SearchFeed from './SearchFeed';
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

class Discover extends PureComponent {
  state = {
    searchValue: '',
  };

  handleOnChangeText = (value) => {
    throttle(
      this.setState({
        searchValue: value,
      }),
      300
    );
  };

  handleOnFocus = () => {
    this.setState({
      isFocused: true,
    });
  };

  renderItem = ({ item }) => (
    <TileContentFeed
      id={item.id}
      name={item.name}
      content={get(item, 'childContentItemsConnection.edges', []).map(
        (edge) => edge.node
      )}
      isLoading={item.isLoading}
      loadingStateObject={childContentItemLoadingState}
    />
  );

  render() {
    return (
      <BackgroundView>
        <SearchInputHeader onChagneText={this.handleOnChangeText} />
        {this.state.isFocused || this.state.searchValue ? (
          <SearchFeed searchValue={this.state.SearchValue} />
        ) : (
          <Query query={GET_CONTENT_CHANNELS} fetchPolicy="cache-and-network">
            {({
              error,
              loading,
              data: { contentChannels = [] } = {},
              refetch,
            }) => (
              <FeedView
                error={error}
                content={contentChannels}
                isLoading={loading}
                refetch={refetch}
                renderItem={this.renderItem}
                loadingStateObject={feedItemLoadingState}
                numColumns={1}
              />
            )}
          </Query>
        )}
      </BackgroundView>
    );
  }
}

Discover.navigationOptions = {
  title: 'Discover',
  headerStyle: ReactNavigationStyleReset.header,
};

export default Discover;
