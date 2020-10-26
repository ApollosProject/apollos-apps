import React from 'react';
import ApollosConfig from '@apollosproject/config';
import PropTypes from 'prop-types';
import analytics from '@metarouter/analytics-react-native';
import { isEqual, last } from 'lodash';
import { AnalyticsConsumer } from './Provider';

function getActiveRouteName(navigationState, routeNames = []) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route, [...routeNames, route.routeName]);
  }

  // Handles routes like ContentItem -> ContentItem (the ContentItem route in the ContentItem navigator)
  if (last(routeNames) === route.routeName) {
    return { routeName: routeNames.join(' > '), params: route.params };
  }
  // Handles all other routes.
  return {
    routeName: [...routeNames, route.routeName].join(' > '),
    params: route.params,
  };
}

const onNavigationStateChange = (track) => (prevState, currentState) => {
  const {
    routeName: currentScreen,
    params: currentParams,
  } = getActiveRouteName(currentState);
  const { routeName: prevScreen, params: prevParams } = getActiveRouteName(
    prevState
  );

  if (prevScreen !== currentScreen || !isEqual(currentParams, prevParams)) {
    analytics.track(`Viewed Screen ${currentScreen}`);
    track({ eventName: `Viewed Screen ${currentScreen}` });
    // Not tracking for now.
    // analytics.screen(currentScreen);
  }
};

analytics.setup(ApollosConfig.ASTRONOMER_KEY || 'a27aHBJqZgkDDfvZ4Q3Zr', {
  // Record screen views automatically!
  recordScreenViews: false,
  // Record certain application events automatically!
  trackAppLifecycleEvents: true,
});

const CoreNavigationAnalytics = ({ children }) => (
  <AnalyticsConsumer>
    {({ track }) =>
      children({ onNavigationStateChange: onNavigationStateChange(track) })
    }
  </AnalyticsConsumer>
);

CoreNavigationAnalytics.propTypes = {
  children: PropTypes.func.isRequired,
};

export { CoreNavigationAnalytics as default, analytics as coreAnalytics };
