import React, { useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/client';
import { ActivityIndicator } from 'react-native';
import { CenteredView } from '@apollosproject/ui-kit';
import PropTypes from 'prop-types';
import GET_LOGIN_STATE_WITH_CACHE_LOADED from './getLoginStateWithCacheLoaded';

const ProtectedRoute = ({
  loggedInRouteName,
  loggedOutRouteName,
  LoadingIndicator,
  onRouteChange,
}) => {
  const navigation = useNavigation();
  const {
    data: { isLoggedIn = false, cacheLoaded = false } = {},
    loading = true,
  } = useQuery(GET_LOGIN_STATE_WITH_CACHE_LOADED, {
    fetchPolicy: 'network-only',
  });
  const isLoading = loading || !cacheLoaded;

  const handleLoginDataChanged = useCallback(() => {
    const shouldNavigate = !isLoading;
    // console.warn(shouldNavigate, isLoading);
    if (shouldNavigate && onRouteChange) onRouteChange({ isLoggedIn });
    if (shouldNavigate && isLoggedIn) {
      navigation.replace(loggedInRouteName);
    } else if (shouldNavigate) {
      navigation.replace(loggedOutRouteName);
    }
  }, [
    navigation,
    isLoading,
    onRouteChange,
    isLoggedIn,
    loggedInRouteName,
    loggedOutRouteName,
  ]);
  useEffect(() => {
    handleLoginDataChanged();
  }, [handleLoginDataChanged]);

  if (LoadingIndicator) return LoadingIndicator;
  return (
    <CenteredView>
      <ActivityIndicator />
    </CenteredView>
  );
};

ProtectedRoute.propTypes = {
  loggedInRouteName: PropTypes.string,
  loggedOutRouteName: PropTypes.string,
  LoadingIndicator: PropTypes.node,
  onRouteChange: PropTypes.func,
};

ProtectedRoute.defaultProps = {
  loggedOutRouteName: 'LandingScreen',
  loggedInRouteName: 'Tabs',
};
export default ProtectedRoute;
