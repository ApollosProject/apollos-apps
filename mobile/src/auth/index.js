import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import PaddedView from 'ui/PaddedView';
import TabView, { SceneMap } from 'ui/TabView';

import LoginForm from './login';
import SignUpForm from './signup';

export LoginButton from './LoginButton';

class Auth extends PureComponent {
  static navigationOptions = {
    title: 'Login',
  };

  tabScenes = SceneMap({
    login: LoginForm,
    signup: SignUpForm,
  });

  tabRoutes = [
    { title: 'Sign In', key: 'login' },
    { title: 'Register', key: 'signup' },
  ];

  static propTypes = {
    navigation: PropTypes.shape({
      goBack: PropTypes.func,
    }),
  };

  handleLogin = () => {
    // trigger the auth modal to close
    this.props.navigation.goBack();
  };

  render() {
    return <TabView routes={this.tabRoutes} renderScene={this.tabScenes} />;
  }
}

export default Auth;
