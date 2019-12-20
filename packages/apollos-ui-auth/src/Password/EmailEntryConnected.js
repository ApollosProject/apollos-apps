/* eslint-disable react/no-unused-prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { LoginConsumer } from '../LoginProvider';
import EmailEntry from './EmailEntry';

class EmailEntryConnected extends Component {
  static propTypes = {
    // Custom component to be rendered. Defaults to EmailEntry
    Component: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func,
      PropTypes.object, // type check for React fragments
    ]),
    client: PropTypes.shape({
      query: PropTypes.func,
    }),
    screenProps: PropTypes.shape({}), // we'll funnel screenProps into props
  };

  static defaultProps = {
    Component: EmailEntry,
    screenProps: {},
  };

  validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required!'),
  });

  flatProps = { ...this.props, ...this.props.screenProps };

  handleOnSubmit = (handleCheckUserExists) => async (
    { email },
    { setSubmitting, setFieldError }
  ) => {
    setSubmitting(true);
    try {
      handleCheckUserExists({ identity: email, authType: 'email' });
    } catch (e) {
      setFieldError(
        'email',
        'There was an error. Please double check your email and try again.'
      );
    }
    setSubmitting(false);
  };

  handleOnPressAlternateLogin = () => {
    this.props.navigation.replace('AuthSMSPhoneEntryConnected');
  };

  render() {
    return (
      <LoginConsumer>
        {({ handleCheckUserExists }) => (
          <Formik
            initialValues={{ email: '' }}
            validationSchema={this.validationSchema}
            onSubmit={this.handleOnSubmit(handleCheckUserExists)}
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
                disabled={isSubmitting || !isValid}
                errors={touched.email && errors}
                isLoading={isSubmitting}
                onPressNext={handleSubmit}
                onPressAlternateLogin={this.handleOnPressAlternateLogin}
                setFieldValue={setFieldValue}
                values={values}
                {...this.flatProps}
              />
            )}
          </Formik>
        )}
      </LoginConsumer>
    );
  }
}

export default EmailEntryConnected;
