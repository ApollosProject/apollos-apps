import React from 'react';
import { Query } from 'react-apollo';
import { createStackNavigator } from 'react-navigation';
import { get } from 'lodash';
import { compose } from 'recompose';

import { withTheme } from 'ui/theme';
import FeedView from 'ui/FeedView';
import BackgroundView from 'ui/BackgroundView';

import GET_USER_FEED from './query';
import tabBarIcon from '../tabBarIcon';
import LiveNowButton from '../../live';

class HomeScreen extends React.Component {
  static navigationOptions = {
    header: ({ state }) => ({
      title: 'Apollos Church',
      // TODO: for the life of me, I can't figure out how to get these colors
      // to be dynamic from theme or props.
      headerStyle: {
        backgroundColor: state.params.backgroundColor,
      },
      headerTintColor: state.params.tintColor,
    }),
  };

  constructor(props) {
    super(props);

    // eslint-disable-next-line
    props.navigation.setParams({
      backgroundColor: props.theme.colors.background.primary, // eslint-disable-line
      tintColor: props.theme.colors.background.paper, // eslint-disable-line
    });
  }

  render() {
    return (
      <BackgroundView>
        <Query query={GET_USER_FEED}>
          {({ loading, error, data, refetch }) => (
            <FeedView
              content={get(data, 'userFeed.edges', [])}
              isLoading={loading}
              error={error}
              refetch={refetch}
              ListHeaderComponent={LiveNowButton}
            />
          )}
        </Query>
      </BackgroundView>
    );
  }
}

export const HomeStack = createStackNavigator(
  {
    Home: compose(withTheme())(HomeScreen),
  },
  {
    initialRouteName: 'Home',
  }
);

HomeStack.navigationOptions = {
  tabBarIcon: tabBarIcon('home'),
};

export default HomeStack;
