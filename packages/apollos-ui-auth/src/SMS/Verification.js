/* eslint-disable react/no-unused-prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { PaddedView, BackgroundView, TextInput } from '@apollosproject/ui-kit';
import { SafeAreaView } from 'react-navigation';
import { Formik } from 'formik';
import * as Yup from 'yup';
import gql from 'graphql-tag';
import { ApolloConsumer, Mutation } from 'react-apollo';

import handleLogin from '../handleLogin';

import {
  NextButtonRow,
  NextButton,
  TitleText,
  PromptText,
  BrandIcon,
} from '../styles';

import { AuthConsumer } from '../Provider';

const VERIFY_PIN = gql`
  mutation verifyPin($phone: String!, $code: String!) {
    authenticateWithSms(phoneNumber: $phone, pin: $code) {
      token
    }
  }
`;
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

  validationSchema = Yup.object().shape({
    phone: Yup.string().matches(/^[6-9]\d{9}$/),
  });

  get flatProps() {
    return { ...this.props, ...(this.props.screenProps || {}) };
  }

  handleOnSubmit = ({ verifyPin, closeAuth }) => async (
    { code },
    { setSubmitting, setFieldError }
  ) => {
    setSubmitting(true);
    try {
      await verifyPin({
        variables: { code, phone: this.props.navigation.state.params.phone },
      });
      closeAuth();
    } catch (e) {
      setFieldError(
        'code',
        'There was an error. Please double check your number and try again.'
      );
    }
    setSubmitting(false);
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
          <AuthConsumer>
            {({ closeAuth }) => (
              <ApolloConsumer>
                {(client) => (
                  <Mutation
                    mutation={VERIFY_PIN}
                    update={(cache, { data: { authenticateWithSms } }) => {
                      client.mutate({
                        mutation: handleLogin,
                        variables: {
                          authToken: authenticateWithSms.token,
                        },
                      });
                    }}
                  >
                    {(verifyPin) => (
                      <Formik
                        initialValues={{ code: '' }}
                        validationSchema={this.validationSchema}
                        onSubmit={this.handleOnSubmit({ verifyPin, closeAuth })}
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
                          <SafeAreaView style={StyleSheet.absoluteFill}>
                            <ScrollView>
                              <PaddedView>
                                {brand}
                                <TitleText>{confirmationTitleText}</TitleText>
                                <PromptText padded>
                                  {confirmationPromptText}
                                </PromptText>
                                <TextInput
                                  autoFocus
                                  label="Verification Code"
                                  type="numeric"
                                  autoComplete="password"
                                  returnKeyType="next"
                                  enzblesReturnKeyAutomatically
                                  error={touched.code && errors.code}
                                  onChangeText={(text) =>
                                    setFieldValue('code', text)
                                  }
                                  value={values.code}
                                />
                              </PaddedView>
                            </ScrollView>
                            <NextButtonRow>
                              <View />
                              <NextButton
                                onPress={handleSubmit}
                                disabled={isSubmitting || !isValid}
                                loading={isSubmitting}
                              />
                            </NextButtonRow>
                          </SafeAreaView>
                        )}
                      </Formik>
                    )}
                  </Mutation>
                )}
              </ApolloConsumer>
            )}
          </AuthConsumer>
        </BackgroundView>
      </KeyboardAvoidingView>
    );
  }
}

export default Verification;
