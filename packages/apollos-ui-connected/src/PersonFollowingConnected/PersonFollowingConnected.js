/**
 * PersonFollowingConnected.js
 *
 * Displays a list of users that a person is following.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { useTheme } from '@apollosproject/ui-kit';
import PersonIsFollowingList from './PersonIsFollowingList';
import PersonIsFollowedByList from './PersonIsFollowedByList';

const { Navigator, Screen } = createMaterialTopTabNavigator();

const PersonFollowingConnected = ({ route }) => {
  const { personId, screen } = route?.params;
  const theme = useTheme();

  return (
    <Navigator
      initialRouteName={screen}
      screenOptions={{
        tabBarActiveTintColor: theme.colors.text.action,
        tabBarInactiveTintColor: theme.colors.text.tertiary,
        tabBarAllowFontScaling: false,
        tabBarLabelStyle: {
          textTransform: 'none',
          fontFamily: theme.typography.sans.bold.default,
        },
      }}
    >
      <Screen
        name="followed_by"
        children={() => <PersonIsFollowedByList personId={personId} />}
        options={{
          tabBarLabel: 'Following Me',
        }}
        initialParams={{ personId }}
      />
      <Screen
        name="following"
        children={() => <PersonIsFollowingList personId={personId} />}
        options={{
          tabBarLabel: "I'm Following",
        }}
      />
    </Navigator>
  );
};

PersonFollowingConnected.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      personId: PropTypes.string.isRequired,
      screen: PropTypes.oneOf(['following', 'followed_by']),
    }),
  }),
};

PersonFollowingConnected.defaultProps = {};

export default PersonFollowingConnected;
