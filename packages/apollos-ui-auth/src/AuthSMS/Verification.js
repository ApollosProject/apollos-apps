/* eslint-disable react/no-unused-prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  H6,
  PaddedView,
  BackgroundView,
  TextInput,
  FlexedView,
} from '@apollosproject/ui-kit';

import {
  NextButtonRow,
  NextButton,
  TitleText,
  PromptText,
  BrandIcon,
} from '../styles';

class Verification extends Component {
  static propTypes = {
    brand: PropTypes.node,
    confirmationTitleText: PropTypes.string,
    confirmationPromptText: PropTypes.string,
    onFinishAuth: PropTypes.func,
    screenProps: PropTypes.shape({}), // we'll funnel screenProps into props
  };

  static defaultProps = {
    brand: <BrandIcon />,
    confirmationTitleText: 'Thanks!\nStand by…',
    confirmationPromptText:
      'We just sent you a code. Enter it below when it comes.',
  };

  get flatProps() {
    return { ...this.props, ...(this.props.screenProps || {}) };
  }

  handleAdvance = () => {
    this.props.navigation.navigate('AuthSMSVerification');
  };

  render() {
    const {
      brand,
      confirmationTitleText,
      confirmationPromptText,
    } = this.flatProps;

    return (
      <KeyboardAvoidingView style={StyleSheet.absoluteFill} behavior="padding">
        <BackgroundView>
          <SafeAreaView style={StyleSheet.absoluteFill}>
            <ScrollView>
              <PaddedView>
                {brand}
                <TitleText>{confirmationTitleText}</TitleText>
                <PromptText padded>{confirmationPromptText}</PromptText>
                <TextInput
                  autoFocus
                  label="Verification Code"
                  type="numeric"
                  autoComplete="password"
                  returnKeyType="next"
                  onSubmitEditing={this.handleAdvance}
                  enzblesReturnKeyAutomatically
                />
              </PaddedView>
            </ScrollView>
            <NextButtonRow>
              <NextButton onPress={this.handleAdvance} />
            </NextButtonRow>
          </SafeAreaView>
        </BackgroundView>
      </KeyboardAvoidingView>
    );
  }
}

export default Verification;
