import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { TabView, TabSceneMap as SceneMap } from '@apollosproject/ui-kit';
import LoginForm from './Login';

import SignUpForm from './Signup';

class AuthPassword extends PureComponent {
  static navigationOptions = {
    header: null,
  };

  tabRoutes = [
    { title: 'Sign In', key: 'login' },
    { title: 'Register', key: 'signup' },
  ];

  static propTypes = {
    navigation: PropTypes.shape({
      goBack: PropTypes.func,
    }),
    onFinish: PropTypes.func,
  };

  handleFinish = () => {
    // trigger the auth modal to close
    // TODO: track({ eventName: 'UserLogin' });
    if (this.props.onFinish) {
      this.props.onFinish();
    } else if (this.props.navigation && this.props.navigation.goBack) {
      this.props.navigation.goBack();
    }
  };

  renderLogin = () => <LoginForm onLogin={this.handleFinish} />;

  renderSignup = () => <SignUpForm onSignup={this.handleFinish} />;

  render() {
    return (
      <TabView
        routes={this.tabRoutes}
        renderScene={SceneMap({
          login: this.renderLogin,
          signup: this.renderSignup,
        })}
      />
    );
  }
}

export default AuthPassword;
