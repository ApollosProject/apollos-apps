import React from 'react';
import { createStackNavigator } from 'react-navigation';
import PropTypes from 'prop-types';
import { styled, ButtonLink, FlexedView } from '@apollosproject/ui-kit';

import {
  SMSPhoneEntry as AuthSMSPhoneEntry,
  SMSVerification as AuthSMSVerification,
} from './AuthSMS';
import AuthPassword from './AuthPassword';

import Header from './Header';

export LoginButton from './LoginButton';
export ProtectedAction from './ProtectedAction';
export ProtectedTouchable from './ProtectedTouchable';
export AuthProvider, { AuthConsumer } from './Provider';
export ProtectedRoute from './ProtectedRoute';

export getLoginState from './getLoginState';
export logout from './logout';
export authLink from './authLink';

export { AuthSMSPhoneEntry, AuthSMSVerification, AuthPassword };

const CancelButton = styled(({ theme }) => ({
  alignSelf: 'flex-end',
  paddingTop: theme.sizing.baseUnit * 0.75,
  paddingRight: theme.sizing.baseUnit,
}))(ButtonLink);

const AuthNavigator = createStackNavigator(
  {
    AuthSMSPhoneEntry,
    AuthSMSVerification,
    AuthPassword,
  },
  {
    initialRouteName: 'AuthSMSPhoneEntry',
    headerMode: 'none',
  }
);

// <CancelButton onPress={this.handleFinish}>Cancel</CancelButton>
AuthNavigator.navigationOptions = ({
  navigation: { goBack },
  screenProps: { cancelText = 'Cancel', allowCancel = true, onFinishAuth } = {},
} = {}) => ({
  header: null,
  // (
  //   <Header>
  //     <FlexedView />
  //     {allowCancel ? (
  //       <CancelButton
  //         onPress={() => (onFinishAuth ? onFinishAuth() : goBack())}
  //       >
  //         {cancelText}
  //       </CancelButton>
  //     ) : null}
  //   </Header>
  // ),
});

AuthNavigator.propTypes = {
  screenProps: PropTypes.shape({
    brand: PropTypes.node,
    authTitleText: PropTypes.string,
    smsPromptText: PropTypes.string,
    smsPolicyInfo: PropTypes.node,
    allowPassword: PropTypes.bool,
    smsOnPasswordLoginPress: PropTypes.func,
    smsPasswordLoginPrompt: PropTypes.node,
    passwordPromptText: PropTypes.string,
    confirmationTitleText: PropTypes.string,
    confirmationPromptText: PropTypes.string,
    onFinishAuth: PropTypes.func,
    allowCancel: PropTypes.bool,
    cancelText: PropTypes.string,
  }),
};

export default AuthNavigator;
