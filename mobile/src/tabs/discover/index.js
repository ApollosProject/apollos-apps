import React from 'react';
import { Query } from 'react-apollo';
import { Button, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import PropTypes from 'prop-types';
import { get, filter } from 'lodash';

import { H5 } from 'ui/typography';
import PaddedView from 'ui/PaddedView';
import BackgroundView from 'ui/BackgroundView';
import HorizontalTileFeed from 'ui/HorizontalTileFeed';
import tabBarIcon from '../tabBarIcon';
import GET_DISCOVER_ITEMS from './query';

export class DiscoverScreen extends React.Component {
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
          {({ loading, error, content, refetch }) => {
            if (loading) return 'Loading...';

            const filteredData = get(content, 'contentChannels', [])
              .filter(
                (channel) =>
                  channel.name === 'Devotion Series' ||
                  channel.name === 'Sermon Series' ||
                  channel.name === 'Editorial'
              )
              .map((filteredChannel) => ({
                id: filteredChannel.id,
                name: filteredChannel.name,
                content: filteredChannel.childContentItemsConnection.edges,
              }));
            return (
              <PaddedView
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <H5>Sermons</H5>
                  <Button
                    title={'View All'}
                    onPress={() => {
                      this.props.navigation.navigate('ContentFeed', {
                        itemId: filter(filteredData, {
                          name: 'Sermon Series',
                        })[0].id,
                        itemTitle: filter(filteredData, {
                          name: 'Sermon Series',
                        })[0].name,
                      });
                    }}
                  />
                </View>
                <HorizontalTileFeed
                  content={filteredData}
                  keyExtractor={keyExtractor}
                  renderItem={() => <H5>hi</H5>}
                  onEndReached={this.fetchMoreHandler({
                    fetchMore,
                    error,
                    loading,
                  })}
                  onEndReachedThreshold={onEndReachedThreshold}
                  onRefresh={this.refetchHandler({ loading, refetch })}
                  refreshing={loading}
                />
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <H5>Devotionals</H5>
                  <Button
                    title={'View All'}
                    onPress={() => {
                      this.props.navigation.navigate('ContentFeed', {
                        itemId: filter(filteredData, {
                          name: 'Devotion Series',
                        })[0].id,
                        itemTitle: filter(filteredData, {
                          name: 'Devotion Series',
                        })[0].name,
                      });
                    }}
                  />
                </View>
                <HorizontalTileFeed
                  content={filteredData}
                  keyExtractor={keyExtractor}
                  renderItem={() => <H5>hi</H5>}
                  onEndReached={this.fetchMoreHandler({
                    fetchMore,
                    error,
                    loading,
                  })}
                  onEndReachedThreshold={onEndReachedThreshold}
                  onRefresh={this.refetchHandler({ loading, refetch })}
                  refreshing={loading}
                />
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <H5>Stories</H5>
                  <Button
                    title={'View All'}
                    onPress={() => {
                      this.props.navigation.navigate('ContentFeed', {
                        itemId: filter(filteredData, { name: 'Editorial' })[0]
                          .id,
                        itemTitle: filter(filteredData, {
                          name: 'Editorial',
                        })[0].name,
                      });
                    }}
                  />
                </View>
                <HorizontalTileFeed
                  content={filteredData}
                  keyExtractor={keyExtractor}
                  renderItem={() => <H5>hi</H5>}
                  onEndReached={this.fetchMoreHandler({
                    fetchMore,
                    error,
                    loading,
                  })}
                  onEndReachedThreshold={onEndReachedThreshold}
                  onRefresh={this.refetchHandler({ loading, refetch })}
                  refreshing={loading}
                />
              </PaddedView>
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
