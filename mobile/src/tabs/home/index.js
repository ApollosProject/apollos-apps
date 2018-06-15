import React from 'react';
import { Query } from 'react-apollo';
import { createStackNavigator } from 'react-navigation';
import { get } from 'lodash';
import FeedView from 'ui/FeedView';
import FlexedView from 'ui/FlexedView';
import GET_USER_FEED from './query';
import LiveNowButton from '../../live';

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Apollos Church',
    // TODO: for the life of me, I can't figure out how to get these colors
    // to be dynamic from theme or props.
    headerStyle: {
      backgroundColor: '#17B582',
    },
    headerTintColor: '#ffffff',
  };

  render() {
    return (
      <FlexedView>
        <Query query={GET_USER_FEED}>
          {({ loading, error, data }) => (
            <FeedView
              content={get(data, 'userFeed.edges', [])}
              isLoading={loading}
              error={error}
              ListHeaderComponent={LiveNowButton}
            />
          )}
        </Query>
      </FlexedView>
    );
  }
}

export const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  {
    initialRouteName: 'Home',
  }
);

export default HomeStack;
