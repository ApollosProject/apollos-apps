import React from 'react';
import { Button } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import PropTypes from 'prop-types';
import BackgroundView from 'ui/BackgroundView';
import Articles from 'articles';
import Devotionals from 'devotionals';
import News from 'news';
import tabBarIcon from '../tabBarIcon';

export class DiscoverScreen extends React.Component {
  static navigationOptions = {
    title: 'Discover',
  };
  render() {
    return (
      <BackgroundView>
        <Button
          title="Articles"
          onPress={() => this.props.navigation.navigate('Articles')}
        />
        <Button
          title="Devotionals"
          onPress={() => this.props.navigation.navigate('Devotionals')}
        />
        <Button
          title="News"
          onPress={() => this.props.navigation.navigate('News')}
        />
      </BackgroundView>
    );
  }
}

DiscoverScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

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
