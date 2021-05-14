import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { withTheme } from '@apollosproject/ui-kit';
import PropTypes from 'prop-types';

import {
  SMSPhoneEntryConnected as AuthSMSPhoneEntryConnected,
  SMSVerification as AuthSMSVerification,
  SMSVerificationConnected as AuthSMSVerificationConnected,
} from './SMS';
import {
  EmailEntryConnected as AuthEmailEntryConnected,
  PasswordEntry as AuthPasswordEntry,
  PasswordEntryConnected as AuthPasswordEntryConnected,
} from './Password';
import {
  ProfileEntry as AuthProfileEntry,
  ProfileEntryConnected as AuthProfileEntryConnected,
} from './Profile';
import {
  ProfileDetailsEntry as AuthProfileDetailsEntry,
  ProfileDetailsEntryConnected as AuthProfileDetailsEntryConnected,
} from './ProfileDetails';

export { default as LoginButton } from './LoginButton';
export { default as ProtectedAction } from './ProtectedAction';
export { default as ProtectedTouchable } from './ProtectedTouchable';
export { default as AuthProvider, AuthConsumer } from './Provider';
export { default as ProtectedRoute } from './ProtectedRoute';

export {
  AUTHENTICATE,
  HANDLE_LOGIN,
  LOGOUT,
  REGISTER_WITH_SMS,
  REGISTER_WITH_EMAIL,
  REQUEST_SMS_PIN,
  VERIFY_PIN,
} from './mutations';
export { GET_LOGIN_STATE, GET_USER_EXISTS } from './queries';
export { default as authLink } from './authLink';
export { default as buildErrorLink } from './buildErrorLink';
export { default as Entry } from './Entry';

export * from './LoginProvider';

export {
  AuthSMSPhoneEntryConnected,
  AuthSMSVerification,
  AuthSMSVerificationConnected,
  AuthEmailEntryConnected,
  AuthPasswordEntry,
  AuthPasswordEntryConnected,
  AuthProfileEntry,
  AuthProfileEntryConnected,
  AuthProfileDetailsEntry,
  AuthProfileDetailsEntryConnected,
};

const AuthStack = createNativeStackNavigator();
const IdentityStack = createNativeStackNavigator();

const AuthNavigator = ({
  alternateLoginText,
  authTitleText,
  confirmationPromptText,
  confirmationTitleText,
  forgotPasswordURL,
  passwordPromptText,
  screenOptions,
}) => (
  <AuthStack.Navigator screenOptions={screenOptions}>
    <AuthStack.Screen name="Identity">
      {() => (
        <IdentityStack.Navigator
          screenOptions={{ stackAnimation: 'none', headerShown: false }}
        >
          <IdentityStack.Screen
            name="AuthSMSPhoneEntryConnected"
            component={AuthSMSPhoneEntryConnected}
            initialParams={{ alternateLoginText, authTitleText }}
          />
          <IdentityStack.Screen
            name="AuthEmailEntryConnected"
            component={AuthEmailEntryConnected}
            initialParams={{ alternateLoginText, authTitleText }}
          />
        </IdentityStack.Navigator>
      )}
    </AuthStack.Screen>
    <AuthStack.Screen
      name="AuthSMSVerificationConnected"
      component={AuthSMSVerificationConnected}
      options={{ headerShown: true }}
      initialParams={{ confirmationTitleText, confirmationPromptText }}
    />
    <AuthStack.Screen
      name="AuthPasswordEntryConnected"
      component={AuthPasswordEntryConnected}
      options={{ headerShown: true }}
      initialParams={{ forgotPasswordURL, passwordPromptText }}
    />
    <AuthStack.Screen
      name="AuthProfileEntryConnected"
      component={AuthProfileEntryConnected}
    />
    <AuthStack.Screen
      name="AuthProfileDetailsEntryConnected"
      component={AuthProfileDetailsEntryConnected}
    />
  </AuthStack.Navigator>
);

AuthNavigator.propTypes = {
  alternateLoginText: PropTypes.string,
  authTitleText: PropTypes.string,
  confirmationTitleText: PropTypes.string,
  confirmationPromptText: PropTypes.string,
  passwordPromptText: PropTypes.string,
  forgotPasswordURL: PropTypes.string,
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

const ThemedAuthNavigator = withTheme(({ theme }) => ({
  screenOptions: {
    headerTintColor: theme.colors.action.secondary,
    headerTitleStyle: {
      color: theme.colors.text.primary,
    },
    headerStyle: {
      backgroundColor: theme.colors.background.paper,
    },
    headerHideShadow: true,
    headerTitle: '',
    headerBackTitle: 'Back',
    headerShown: false,
  },
}))(AuthNavigator);

export default ThemedAuthNavigator;
