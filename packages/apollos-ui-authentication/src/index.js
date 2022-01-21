import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { withTheme } from '@apollosproject/ui-kit';
import PropTypes from 'prop-types';

import {
  IdentityEntryConnected,
  IdentityVerificationConnected,
} from './Identity';

import {
  ProfileEntry as AuthProfileEntry,
  ProfileEntryConnected as AuthProfileEntryConnected,
} from './Profile';
import { OpenIDConnected } from './OpenID';

export { default as AuthProvider, AuthConsumer } from './Provider';
export { default as ProtectedRoute } from './ProtectedRoute';

export { default as authLink } from './authLink';
export { default as buildErrorLink } from './buildErrorLink';
export { default as Entry } from './Entry';

export * from './LoginProvider';
export { useIsLoggedIn, useLogout } from './Provider';

export { AuthProfileEntry, AuthProfileEntryConnected };

const AuthStack = createNativeStackNavigator();

const AuthNavigator = ({
  alternateLoginText,
  authTitleText,
  confirmationPromptText,
  confirmationTitleText,
  screenOptions,
}) => (
  <AuthStack.Navigator screenOptions={screenOptions}>
    <AuthStack.Screen
      name="IdentityEntryConnected'"
      component={IdentityEntryConnected}
      initialParams={{ alternateLoginText, authTitleText }}
    />
    <AuthStack.Screen
      name="IdentityVerificationConnected"
      component={IdentityVerificationConnected}
      initialParams={{ confirmationTitleText, confirmationPromptText }}
    />
    <AuthStack.Screen
      name="AuthProfileEntryConnected"
      component={AuthProfileEntryConnected}
    />
    <AuthStack.Screen name="OpenIDConnected" component={OpenIDConnected} />
  </AuthStack.Navigator>
);

AuthNavigator.propTypes = {
  alternateLoginText: PropTypes.string,
  authTitleText: PropTypes.string,
  confirmationTitleText: PropTypes.string,
  confirmationPromptText: PropTypes.string,
  screenOptions: PropTypes.shape({
    headerTintColor: PropTypes.string,
    headerTitleStyle: PropTypes.shape({
      color: PropTypes.string,
    }),
    headerStyle: PropTypes.shape({
      backgroundColor: PropTypes.string,
    }),
    headerHideShadow: PropTypes.bool,
    headerTitle: PropTypes.string,
    headerBackTitle: PropTypes.string,
    headerShown: PropTypes.bool,
  }),
};

const ThemedAuthNavigator = withTheme(() => ({
  screenOptions: {
    headerStyle: {
      blurEffect: 'systemChromeMaterial',
      backgroundColor: 'transparent',
    },
    headerTranslucent: true,
    headerHideShadow: true,
    headerTitle: '',
    headerBackTitle: 'Back',
    headerShown: true,
  },
}))(AuthNavigator);

export default ThemedAuthNavigator;
