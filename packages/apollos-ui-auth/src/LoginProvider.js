import React from 'react';
import PropTypes from 'prop-types';

import { ApolloConsumer } from '@apollo/client';
import { GET_USER_EXISTS } from './queries';

import {
  VERIFY_PIN,
  HANDLE_LOGIN,
  AUTHENTICATE,
  REGISTER_WITH_SMS,
  REGISTER_WITH_EMAIL,
  REQUEST_SMS_PIN,
} from './mutations';

const LoginContext = React.createContext({
  authType: null,
  userProfile: {},
  newUser: false,
});

class LoginProvider extends React.Component {
  static propTypes = {
    client: PropTypes.shape({
      mutate: PropTypes.func.isRequired,
      query: PropTypes.func.isRequired,
    }).isRequired,
    navigate: PropTypes.func.isRequired,
    closeAuth: PropTypes.func.isRequired,
    children: PropTypes.node,
  };

  state = {
    authType: null, // one of 'sms', 'email'
    userProfile: {},
    newUser: false,
    identity: null,
  };

  get value() {
    return {
      handleSubmitLogin: this.handleSubmitLogin,
      handleCheckUserExists: this.handleCheckUserExists,
      handleProfileComplete: this.handleProfileComplete,
      handleUpdateProfile: this.handleUpdateProfile,
      authType: this.state.authType,
      userProfile: this.state.userProfile,
      newUser: this.state.newUser,
      identity: this.state.identity,
    };
  }

  handleSubmitLogin = ({ password }) => {
    if (this.state.newUser) {
      return this.handleRegister({ password });
    }
    return this.handleLogin({ password });
  };

  handleLogin = async ({ password }) => {
    const { client, closeAuth } = this.props;
    const { authType, identity } = this.state;

    let token;

    if (authType === 'sms') {
      const { data } = await client.mutate({
        mutation: VERIFY_PIN,
        variables: { phone: identity, code: password },
      });
      token = data.authenticateWithSms.token; // eslint-disable-line prefer-destructuring
    } else {
      const { data } = await client.mutate({
        mutation: AUTHENTICATE,
        variables: { password, email: identity },
      });
      token = data.authenticate.token; // eslint-disable-line prefer-destructuring
    }

    await client.mutate({
      mutation: HANDLE_LOGIN,
      variables: {
        authToken: token,
      },
    });
    closeAuth();
  };

  handleRegister = async ({ password }) => {
    const { client, closeAuth } = this.props;
    const { authType, identity, userProfile } = this.state;

    const profileFields = Object.keys(userProfile).map((key) => ({
      field: key,
      value: userProfile[key],
    }));
    let token;

    if (authType === 'sms') {
      const { data } = await client.mutate({
        mutation: REGISTER_WITH_SMS,
        variables: {
          identity,
          password,
          userProfile: profileFields,
        },
      });
      token = data.registerWithSms.token; // eslint-disable-line prefer-destructuring
    } else {
      const { data } = await client.mutate({
        mutation: REGISTER_WITH_EMAIL,
        variables: {
          identity,
          password,
          userProfile: profileFields,
        },
      });
      token = data.registerPerson.token; // eslint-disable-line prefer-destructuring
    }

    await client.mutate({
      mutation: HANDLE_LOGIN,
      variables: {
        authToken: token,
      },
    });
    closeAuth();
  };

  handleCheckUserExists = async ({ identity, authType }) => {
    const { client, navigate } = this.props;

    const {
      data: { userExists },
    } = await client.query({
      query: GET_USER_EXISTS,
      variables: { identity },
      fetchPolicy: 'network-only',
    });

    const newUser = userExists === 'NONE';
    this.setState({ identity, authType, newUser });

    if (newUser) {
      navigate('AuthProfileEntryConnected');
    } else if (authType === 'sms') {
      await client.mutate({
        mutation: REQUEST_SMS_PIN,
        variables: { phone: identity },
      });
      navigate('AuthSMSVerificationConnected');
    } else if (authType === 'email') {
      navigate('AuthPasswordEntryConnected');
    }
  };

  handleUpdateProfile = async ({ userProfile }) => {
    const { navigate } = this.props;

    this.setState((prevState) => ({
      userProfile: { ...prevState.userProfile, ...userProfile },
    }));
    navigate('AuthProfileDetailsEntryConnected');
  };

  handleProfileComplete = async ({ userProfile }) => {
    const { client, navigate } = this.props;

    this.setState((prevState) => ({
      userProfile: { ...prevState.userProfile, ...userProfile },
    }));
    if (this.state.authType === 'sms') {
      await client.mutate({
        mutation: REQUEST_SMS_PIN,
        variables: { phone: this.state.identity },
      });
      navigate('AuthSMSVerificationConnected');
    } else {
      navigate('AuthPasswordEntryConnected');
    }
  };

  render() {
    return (
      <LoginContext.Provider value={this.value}>
        {this.props.children}
      </LoginContext.Provider>
    );
  }
}

const LoginProviderWithApollo = (props) => (
  <ApolloConsumer>
    {(client) => <LoginProvider client={client} {...props} />}
  </ApolloConsumer>
);

const { Consumer } = LoginContext;

export { LoginProviderWithApollo as LoginProvider, Consumer as LoginConsumer };
