import React, { PureComponent } from 'react';
import { Query } from '@apollo/client/react/components';
import { ActivityIndicator } from 'react-native';
import { CenteredView } from '@apollosproject/ui-kit';
import PropTypes from 'prop-types';
import GET_LOGIN_STATE_WITH_CACHE_LOADED from './getLoginStateWithCacheLoaded';

/* This function can be included as the default route in your navigator
to direct the user to a different route depending on if the user is logged in or not.

Usage:
```
const AuthLoading = (props) => <AuthLoadingSwitch loggedInRouteName="Home" loggedOutRouteName="Auth" LoadingIndicator={LoadingComponent}

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

class ProtectedRoute extends PureComponent {
  static propTypes = {
    navigation: PropTypes.shape({ replace: PropTypes.func.isRequired })
      .isRequired,
    isLoading: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    loggedInRouteName: PropTypes.string,
    loggedOutRouteName: PropTypes.string,
    LoadingIndicator: PropTypes.node,
    onRouteChange: PropTypes.func,
  };

  static defaultProps = {
    loggedOutRouteName: 'LandingScreen',
    loggedInRouteName: 'Tabs',
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
      onRouteChange,
      navigation,
      loggedInRouteName,
      loggedOutRouteName,
    } = this.props;

    const shouldNavigate = !isLoading;
    // console.warn(shouldNavigate, isLoading);
    if (shouldNavigate && onRouteChange) onRouteChange({ isLoggedIn });
    if (shouldNavigate && isLoggedIn) {
      navigation.replace(loggedInRouteName);
    } else if (shouldNavigate) {
      navigation.replace(loggedOutRouteName);
    }
  };

  render() {
    const { LoadingIndicator } = this.props;
    if (LoadingIndicator) return LoadingIndicator;
    return (
      <CenteredView>
        <ActivityIndicator />
      </CenteredView>
    );
  }
}

const ProtectedRouteWithData = (props) => (
  <Query fetchPolicy={'network-only'} query={GET_LOGIN_STATE_WITH_CACHE_LOADED}>
    {({
      data: { isLoggedIn = false, cacheLoaded = false } = {},
      loading = true,
    }) => (
      <ProtectedRoute
        {...props}
        isLoggedIn={isLoggedIn}
        isLoading={loading || !cacheLoaded}
      />
    )}
  </Query>
);

export default ProtectedRouteWithData;
