/* eslint-disable react/no-unused-prop-types, react/jsx-handler-names */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ApolloConsumer, Mutation } from 'react-apollo';

import HANDLE_LOGIN from '../handleLogin';
import { AuthConsumer } from '../Provider';

import Verification from './Verification';
import VERIFY_PIN from './verifyPin';

class VerificationConnected extends Component {
  static propTypes = {
    // Custom component to be rendered. Defaults to Verification
    Component: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func,
      PropTypes.object, // type check for React fragments
    ]),
    screenProps: PropTypes.shape({}), // we'll funnel screenProps into props
  };

  static defaultProps = {
    Component: Verification,
    screenProps: {},
  };

  validationSchema = Yup.object().shape({
    phone: Yup.string().matches(/^[6-9]\d{9}$/),
  });

  flatProps = { ...this.props, ...this.props.screenProps };

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
    return (
      <AuthConsumer>
        {({ closeAuth }) => (
          <ApolloConsumer>
            {(client) => (
              <Mutation
                mutation={VERIFY_PIN}
                update={(cache, { data: { authenticateWithSms } }) => {
                  client.mutate({
                    mutation: HANDLE_LOGIN,
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
                      <this.props.Component
                        errors={touched.code && errors}
                        disabled={isSubmitting || !isValid}
                        isLoading={isSubmitting}
                        onPressNext={handleSubmit}
                        onPressBack={this.props.navigation.goBack}
                        setFieldValue={setFieldValue}
                        touched={touched}
                        values={values}
                        {...this.flatProps}
                      />
                    )}
                  </Formik>
                )}
              </Mutation>
            )}
          </ApolloConsumer>
        )}
      </AuthConsumer>
    );
  }
}

export default VerificationConnected;
