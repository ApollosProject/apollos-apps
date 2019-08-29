/* eslint-disable react/no-unused-prop-types */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import {
  BackgroundView,
  TabView,
  PaddedView,
  TabSceneMap as SceneMap,
} from '@apollosproject/ui-kit';
import { SafeAreaView } from 'react-navigation';

import { PromptText } from '../styles';
import { AuthConsumer } from '../Provider';
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
    passwordPromptText: PropTypes.string,
    screenProps: PropTypes.shape({}), // we'll funnel screenProps into props
    BackgroundComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  };

  static defaultProps = {
    passwordPromptText: 'Login with your email and password.',
    BackgroundComponent: BackgroundView,
  };

  get flatProps() {
    return { ...this.props, ...(this.props.screenProps || {}) };
  }

  render() {
    const { BackgroundComponent, emailRequired } = this.flatProps;
    return (
      <AuthConsumer>
        {({ closeAuth }) => (
          <KeyboardAvoidingView
            style={StyleSheet.absoluteFill}
            behavior="padding"
          >
            <BackgroundComponent>
              <SafeAreaView style={StyleSheet.absoluteFill}>
                <PaddedView>
                  <PromptText>{this.flatProps.passwordPromptText}</PromptText>
                </PaddedView>

                <TabView
                  routes={this.tabRoutes}
                  renderScene={SceneMap({
                    login: () => (
                      <LoginForm
                        onLogin={closeAuth}
                        emailRequired={emailRequired}
                      />
                    ),
                    signup: () => (
                      <SignUpForm
                        onSignup={closeAuth}
                        emailRequired={emailRequired}
                      />
                    ),
                  })}
                />
              </SafeAreaView>
            </BackgroundComponent>
          </KeyboardAvoidingView>
        )}
      </AuthConsumer>
    );
  }
}

export default AuthPassword;
