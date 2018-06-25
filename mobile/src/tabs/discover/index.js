import React from 'react';
import { Query } from 'react-apollo';
import { Button, FlatList } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import BackgroundView from 'ui/BackgroundView';
import { ErrorCard } from 'ui/Card';
import Articles from 'articles';
import Devotionals from 'devotionals';
import News from 'news';
import tabBarIcon from '../tabBarIcon';
import GET_DISCOVER_ITEMS from './query';

export class DiscoverScreen extends React.Component {
  static navigationOptions = {
    title: 'Discover',
  };

  static propTypes = {
    keyExtractor: PropTypes.func,
    ListEmptyComponent: PropTypes.func,
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }),
  };

  static defaultProps = {
    keyExtractor: (item) => item && item.id,
  };

  onPress = ({ item }) => {
    console.log('item = ', item);
    this.props.navigation.navigate('ContentFeed', {
      itemId: item.id,
      itemTitle: item.title,
    });
  };

  render() {
    const { ListEmptyComponent, keyExtractor } = this.props;
    return (
      <BackgroundView>
        <Query query={GET_DISCOVER_ITEMS}>
          {({ loading, error, data }) => {
            if (loading) return 'Loading...';

            return (
              <FlatList
                data={get(data, 'contentChannels', [])}
                keyExtractor={keyExtractor}
                ListEmptyComponent={
                  error && !loading && (!data || !data.length) ? (
                    <ErrorCard error={error} />
                  ) : (
                    ListEmptyComponent
                  )
                }
                renderItem={({ item }) => (
                  <Button
                    title={item.name}
                    onPress={() => {
                      this.props.navigation.navigate('ContentFeed', {
                        itemId: item.id,
                        itemTitle: item.title,
                      });
                    }}
                  />
                )}
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
    Articles,
    Devotionals,
    News,
  },
  {
    initialRouteName: 'Discover',
  }
);

DiscoverStack.navigationOptions = {
  tabBarIcon: tabBarIcon('sections'),
};

export default DiscoverStack;
