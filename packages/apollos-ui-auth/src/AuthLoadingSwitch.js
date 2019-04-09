import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import { ActivityIndicator, View } from 'react-native';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';

/* This function can be included as the default route in your navigator
to direct the user to a different route depending on if the user is logged in or not.

Usage:
```
const AuthLoading = (props) => <AuthLoadingSwitch loggedInRouteName="Home" authRouteName="Auth" LoadingIndicator={LoadingComponent}

const AppNavigator = createStackNavigator(
  {
    AuthLoading,
    Home,
    Auth,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);
```
*/

class AuthLoading extends PureComponent {
  static propTypes = {
    navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired })
      .isRequired,
    isLoading: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    loggedInRouteName: PropTypes.string,
    authRouteName: PropTypes.string,
    LoadingIndicator: PropTypes.node,
  };

  componentDidMount() {
    this.handleLoginDataChanged();
  }

  componentDidUpdate() {
    this.handleLoginDataChanged();
  }

  handleLoginDataChanged = () => {
    const {
      isLoading,
      isLoggedIn,
      navigation,
      loggedInRouteName,
      authRouteName,
    } = this.props;

    if (!isLoading && isLoggedIn) {
      navigation.navigate(loggedInRouteName || 'Tabs');
    } else if (!isLoading) {
      navigation.navigate(authRouteName || 'Auth');
    }
  };

  render() {
    const { LoadingIndicator } = this.props;
    if (LoadingIndicator) return LoadingIndicator;
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }
}

export const getLoginWithCacheLoaded = gql`
  query getLoginWithCacheLoaded {
    isLoggedIn @client
    cacheLoaded @client
  }
`;

const AuthLoadingWithData = (props) => (
  <Query fetchPolicy={'network-only'} query={getLoginWithCacheLoaded}>
    {({
      data: { isLoggedIn = false, cacheLoaded = false } = {},
      loading = true,
    }) => (
      <AuthLoading
        {...props}
        isLoggedIn={isLoggedIn}
        isLoading={loading || !cacheLoaded}
      />
    )}
  </Query>
);

export default AuthLoadingWithData;
