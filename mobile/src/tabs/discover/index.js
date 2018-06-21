import React, { PureComponent } from 'react';
import { Button } from 'react-native';
import { Query } from 'react-apollo';
import { createStackNavigator } from 'react-navigation';
import PropTypes from 'prop-types';
import BackgroundView from 'ui/BackgroundView';
import ActivityIndicator from 'ui/ActivityIndicator';
import ContentFeed from 'content-feed';
import getContentChannels from './getContentChannels.graphql';
import tabBarIcon from '../tabBarIcon';

class Discover extends PureComponent {
  static navigationOptions = {
    title: 'Discover',
  };

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }),
  };

  render() {
    return (
      <BackgroundView>
        <Query query={getContentChannels}>
          {({ loading, data: { contentChannels = [] } = {} }) => {
            if (loading) return <ActivityIndicator />;
            return contentChannels.map(({ id, name }) => (
              <Button
                key={id}
                onPress={() =>
                  this.props.navigation.navigate('ContentFeed', { id })
                }
                title={name}
              />
            ));
          }}
        </Query>
      </BackgroundView>
    );
  }
}

const DiscoverNavigator = createStackNavigator(
  {
    Discover,
    ContentFeed,
  },
  {
    initialRouteName: 'Discover',
  }
);

DiscoverNavigator.navigationOptions = {
  tabBarIcon: tabBarIcon('sections'),
};

export default DiscoverNavigator;
