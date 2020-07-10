import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PropTypes from 'prop-types';
import hoistNonReactStatic from 'hoist-non-react-statics';

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

export LoginButton from './LoginButton';
export ProtectedAction from './ProtectedAction';
export ProtectedTouchable from './ProtectedTouchable';
export AuthProvider, { AuthConsumer } from './Provider';
export ProtectedRoute from './ProtectedRoute';

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
export authLink from './authLink';
export buildErrorLink from './buildErrorLink';
export Entry from './Entry';

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

const AuthStack = createStackNavigator();

const AuthNavigator = (props) => (
  <AuthStack.Navigator
    initialRouteName="AuthSMSPhoneEntryConnected"
    headerMode="none"
    navigationOptions={{ header: null }}
    {...props}
  >
    <AuthStack.Screen
      name="AuthSMSPhoneEntryConnected"
      component={AuthSMSPhoneEntryConnected}
    />
    <AuthStack.Screen
      name="AuthSMSVerificationConnected"
      component={AuthSMSVerificationConnected}
    />
    <AuthStack.Screen
      name="AuthEmailEntryConnected"
      component={AuthEmailEntryConnected}
    />
    <AuthStack.Screen
      name="AuthPasswordEntryConnected"
      component={AuthPasswordEntryConnected}
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
  screenProps: PropTypes.shape({
    alternateLoginText: PropTypes.node,
    authTitleText: PropTypes.string,
    confirmationTitleText: PropTypes.string,
    confirmationPromptText: PropTypes.string,
    onFinishAuth: PropTypes.func,
    passwordPromptText: PropTypes.string,
    smsPolicyInfo: PropTypes.node,
    smsPromptText: PropTypes.string,
    emailRequired: PropTypes.bool,
    handleForgotPassword: PropTypes.func,
  }),
  BackgroundComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

const Auth = (props) => <AuthNavigator {...props} screenProps={props} />;
hoistNonReactStatic(Auth, AuthNavigator);

export default Auth;
