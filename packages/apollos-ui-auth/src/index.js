import { createStackNavigator } from 'react-navigation';
import PropTypes from 'prop-types';

import {
  SMSPhoneEntry as AuthSMSPhoneEntry,
  SMSVerification as AuthSMSVerification,
} from './SMS';
import AuthPassword from './Password';

export LoginButton from './LoginButton';
export ProtectedAction from './ProtectedAction';
export ProtectedTouchable from './ProtectedTouchable';
export AuthProvider, { AuthConsumer } from './Provider';
export ProtectedRoute from './ProtectedRoute';

export getLoginState from './getLoginState';
export logout from './logout';
export authLink from './authLink';

export { AuthSMSPhoneEntry, AuthSMSVerification, AuthPassword };

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

AuthNavigator.navigationOptions = {
  header: null,
};

AuthNavigator.propTypes = {
  screenProps: PropTypes.shape({
    brand: PropTypes.node,
    authTitleText: PropTypes.string,
    smsPromptText: PropTypes.string,
    smsPolicyInfo: PropTypes.node,
    allowPassword: PropTypes.bool,
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
