import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { Button, View, ScrollView } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import PropTypes from 'prop-types';
import { get, filter } from 'lodash';

import { H5 } from 'ui/typography';
import PaddedView from 'ui/PaddedView';
import TileImage from 'ui/TileImage';
import BackgroundView from 'ui/BackgroundView';
import HorizontalTileFeed from 'ui/HorizontalTileFeed';
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

            const filteredData = get(data, 'contentChannels', [])
              .filter(
                ({ name }) =>
                  name === 'Devotion Series' ||
                  name === 'Sermon Series' ||
                  name === 'Editorial'
              )
              .map(({ id, name, childContentItemsConnection }) => ({
                id,
                name,
                content: childContentItemsConnection.edges,
              }));

            const getIndividualContentFor = (contentName) =>
              filter(filteredData, {
                name: contentName,
              })[0];

            const renderTileImage = ({
              item: {
                node: { id, title, coverImage: { sources } = {} } = {},
              } = {},
            }) => (
              <TileImage
                onPressItem={() => console.log('Hi')}
                key={id}
                text={title}
                image={sources[0].uri}
              />
            );

            return (
              <ScrollView>
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
                          itemId: getIndividualContentFor('Sermon Series').id,
                          itemTitle: getIndividualContentFor('Sermon Series')
                            .name,
                        });
                      }}
                    />
                  </View>
                  <HorizontalTileFeed
                    content={getIndividualContentFor('Sermon Series').content}
                    keyExtractor={keyExtractor}
                    renderItem={renderTileImage}
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
                          itemId: getIndividualContentFor('Devotion Series').id,
                          itemTitle: getIndividualContentFor('Devotion Series')
                            .name,
                        });
                      }}
                    />
                  </View>
                  <HorizontalTileFeed
                    content={getIndividualContentFor('Devotion Series').content}
                    keyExtractor={keyExtractor}
                    renderItem={renderTileImage}
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
                          itemId: getIndividualContentFor('Editorial').id,
                          itemTitle: getIndividualContentFor('Editorial').name,
                        });
                      }}
                    />
                  </View>
                  <HorizontalTileFeed
                    content={getIndividualContentFor('Editorial').content}
                    keyExtractor={keyExtractor}
                    renderItem={renderTileImage}
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
              </ScrollView>
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
