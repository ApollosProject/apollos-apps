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
  styled,
} from '@apollosproject/ui-kit';

import {
  NextButtonRow,
  NextButton,
  TitleText,
  PromptText,
  BrandIcon,
} from '../styles';

class PhoneEntry extends Component {
  static propTypes = {
    brand: PropTypes.node,
    authTitleText: PropTypes.string,
    smsPromptText: PropTypes.string,
    smsPolicyInfo: PropTypes.node,
    allowPassword: PropTypes.bool,
    smsOnPasswordLoginPress: PropTypes.func,
    smsPasswordLoginPrompt: PropTypes.node,
    screenProps: PropTypes.shape({}), // we'll funnel screenProps into props
  };

  static defaultProps = {
    brand: <BrandIcon />,
    authTitleText: 'Have we met before?',
    smsPromptText:
      "Lets get you signed in using your mobile number. We'll text you a code to make login super easy!",
    smsPolicyInfo: (
      <H6>
        {"We'll never share your information or contact you (unless you ask!)."}
      </H6>
    ),
    smsPasswordLoginPrompt: "I'd rather use my email and a password",
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
      authTitleText,
      smsPromptText,
      smsPolicyInfo,
      // allowPassword,
      // smsOnPasswordLoginPress,
      // smsPasswordLoginPrompt,
    } = this.flatProps;

    return (
      <KeyboardAvoidingView style={StyleSheet.absoluteFill} behavior="padding">
        <BackgroundView>
          <SafeAreaView style={StyleSheet.absoluteFill}>
            <ScrollView>
              <PaddedView>
                {brand}
                <TitleText>{authTitleText}</TitleText>
                <PromptText padded>{smsPromptText}</PromptText>
                <TextInput
                  autoFocus
                  autoComplete="tel"
                  label="Mobile Number"
                  type="phone"
                  returnKeyType="next"
                  onSubmitEditing={this.handleAdvance}
                  enzblesReturnKeyAutomatically
                />
              </PaddedView>
            </ScrollView>
            <NextButtonRow>
              <FlexedView>{smsPolicyInfo}</FlexedView>
              <NextButton onPress={this.handleAdvance} />
            </NextButtonRow>
          </SafeAreaView>
        </BackgroundView>
      </KeyboardAvoidingView>
    );
  }
}

export default PhoneEntry;
