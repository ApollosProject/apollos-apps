import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { createStackNavigator } from 'react-navigation';
import PropTypes from 'prop-types';

import BackgroundView from 'ui/BackgroundView';
import DiscoverContentFeed from './discoverContentFeed';
import tabBarIcon from '../tabBarIcon';
import GET_DISCOVER_ITEMS from './query';

export class DiscoverScreen extends Component {
  static navigationOptions = {
    title: 'Discover',
  };

  static propTypes = {
    fetchMore: PropTypes.func,
    keyExtractor: PropTypes.func,
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }),
    onEndReachedThreshold: PropTypes.number,
  };

  static defaultProps = {
    fetchMore: undefined,
    keyExtractor: (item) => item && item.id,
    onEndReachedThreshold: 0.7,
  };

  refetchHandler = ({ isLoading, refetch }) =>
    refetch && ((...args) => !isLoading && refetch(...args));

  fetchMoreHandler = ({ fetchMore, error, isLoading }) =>
    fetchMore && ((...args) => !isLoading && !error && fetchMore(...args));

  render() {
    const { fetchMore, keyExtractor, onEndReachedThreshold } = this.props;
    return (
      <BackgroundView>
        <Query query={GET_DISCOVER_ITEMS}>
          {({ loading, error, data, refetch }) => {
            if (loading) return 'Loading...';

            return (
              <DiscoverContentFeed
                data={data}
                onEndReached={this.fetchMoreHandler({
                  fetchMore,
                  error,
                  loading,
                })}
                navigation={this.props.navigation}
                loading={loading}
                onRefresh={this.refetchHandler({ loading, refetch })}
                keyExtractor={keyExtractor}
                onEndReachedThreshold={onEndReachedThreshold}
              />
            );
          }}
        </Query>
      </BackgroundView>
    );
  }
}

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
