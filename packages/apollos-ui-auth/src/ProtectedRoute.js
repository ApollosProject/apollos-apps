import React, { PureComponent } from 'react';
import { Query } from 'react-apollo';
import { ActivityIndicator } from 'react-native';
import { CenteredView } from '@apollosproject/ui-kit';
import PropTypes from 'prop-types';
import { withNavigationFocus } from 'react-navigation';
import getLoginStateWithCacheLoaded from './getLoginStateWithCacheLoaded';

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

class AuthLoading extends PureComponent {
  static propTypes = {
    navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired })
      .isRequired,
    isLoading: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    loggedInRouteName: PropTypes.string,
    loggedOutRouteName: PropTypes.string,
    LoadingIndicator: PropTypes.node,
    isFocused: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    loggedOutRouteName: 'Auth',
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
      navigation,
      loggedInRouteName,
      loggedOutRouteName,
      isFocused,
    } = this.props;

    const shouldNavigate = !isLoading && isFocused;
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

const AuthLoadingWithFocus = withNavigationFocus(AuthLoading);

const AuthLoadingWithData = (props) => (
  <Query fetchPolicy={'network-only'} query={getLoginStateWithCacheLoaded}>
    {({
      data: { isLoggedIn = false, cacheLoaded = false } = {},
      loading = true,
    }) => (
      <AuthLoadingWithFocus
        {...props}
        isLoggedIn={isLoggedIn}
        isLoading={loading || !cacheLoaded}
      />
    )}
  </Query>
);

export default AuthLoadingWithData;
