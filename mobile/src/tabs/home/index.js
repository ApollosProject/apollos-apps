import React from 'react';
import { Query } from 'react-apollo';
import { createStackNavigator } from 'react-navigation';
import FeedView from 'ui/FeedView';
import GET_USER_FEED from './query';

export class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };
  render() {
    return (
      <Query query={GET_USER_FEED}>
        {({ loading, error, data }) => {
          console.log('data.userFeed.edges = ', data.userFeed.edges);
          return (
            <FeedView
              content={data.userFeed}
              isLoading={loading}
              error={error}
            />
          );
        }}
      </Query>
    );
  }
}

export const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  {
    initialRouteName: 'Home',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);

export default HomeStack;
