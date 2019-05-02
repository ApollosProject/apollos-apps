/* eslint-disable react/no-unused-prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
  styled,
  H6,
  PaddedView,
  BackgroundView,
  TextInput,
  ButtonLink,
} from '@apollosproject/ui-kit';
import { Formik } from 'formik';
import * as Yup from 'yup';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import {
  NextButtonRow,
  NextButton,
  TitleText,
  PromptText,
  BrandIcon,
} from '../styles';

const requestPin = gql`
  mutation requestPin($phone: String!) {
    requestSmsLoginPin(phoneNumber: $phone) {
      success
    }
  }
`;

const FlexedSafeAreaView = styled({
  flex: 1,
})(SafeAreaView);
const forceInset = { top: 'always' };

const LegalText = styled({
  width: '70%',
})(H6);

class PhoneEntry extends Component {
  static propTypes = {
    brand: PropTypes.node,
    authTitleText: PropTypes.string,
    smsPromptText: PropTypes.string,
    smsPolicyInfo: PropTypes.node,
    allowPassword: PropTypes.bool,
    smsPasswordLoginPrompt: PropTypes.node,
    screenProps: PropTypes.shape({}), // we'll funnel screenProps into props
  };

  static defaultProps = {
    brand: <BrandIcon />,
    authTitleText: 'Have we met before?',
    smsPromptText:
      "Lets get you signed in using your mobile number. We'll text you a code to make login super easy!",
    smsPolicyInfo: (
      <LegalText>
        {"We'll never share your information or contact you (unless you ask!)."}
      </LegalText>
    ),
    allowPassword: true,
    smsPasswordLoginPrompt: "I'd rather use my email and a password",
  };

  validationSchema = Yup.object().shape({
    phone: Yup.string().matches(
      /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/,
      'Your phone number appears to be invalid'
    ),
  });

  get flatProps() {
    return { ...this.props, ...(this.props.screenProps || {}) };
  }

  handleOnSubmit = (mutate) => async (
    { phone },
    { setSubmitting, setFieldError }
  ) => {
    setSubmitting(true);
    try {
      await mutate({ variables: { phone } });
      this.props.navigation.navigate('AuthSMSVerification', { phone });
    } catch (e) {
      setFieldError(
        'phone',
        'There was an error. Please double check your number and try again.'
      );
    }
    setSubmitting(false);
  };

  handlePasswordLoginPress = () => {
    this.props.navigation.navigate('AuthPassword');
  };

  render() {
    const {
      brand,
      authTitleText,
      smsPromptText,
      smsPolicyInfo,
      allowPassword,
      smsPasswordLoginPrompt,
    } = this.flatProps;

    return (
      <KeyboardAvoidingView style={StyleSheet.absoluteFill} behavior="padding">
        <BackgroundView>
          <Mutation mutation={requestPin}>
            {(mutate) => (
              <Formik
                initialValues={{ phone: '' }}
                validationSchema={this.validationSchema}
                onSubmit={this.handleOnSubmit(mutate)}
              >
                {({
                  setFieldValue,
                  handleSubmit,
                  values,
                  isSubmitting,
                  isValid,
                  touched,
                  errors,
                }) => (
                  <FlexedSafeAreaView forceInset={forceInset}>
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
                          error={touched.phone && errors.phone}
                          onChangeText={(text) => setFieldValue('phone', text)}
                          value={values.phone}
                        />
                      </PaddedView>
                      {allowPassword ? (
                        <PaddedView>
                          <ButtonLink onPress={this.handlePasswordLoginPress}>
                            {smsPasswordLoginPrompt}
                          </ButtonLink>
                        </PaddedView>
                      ) : null}
                    </ScrollView>
                    <NextButtonRow>
                      {smsPolicyInfo}
                      <NextButton
                        onPress={handleSubmit}
                        disabled={isSubmitting || !isValid}
                        loading={isSubmitting}
                      />
                    </NextButtonRow>
                  </FlexedSafeAreaView>
                )}
              </Formik>
            )}
          </Mutation>
        </BackgroundView>
      </KeyboardAvoidingView>
    );
  }
}

export default PhoneEntry;
