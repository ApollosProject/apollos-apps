/* eslint-disable react/no-unused-prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { LoginConsumer } from '../LoginProvider';
import Entry from '../Entry';

class EmailEntryConnected extends Component {
  static propTypes = {
    alternateLoginText: PropTypes.string,
    // Custom component to be rendered. Defaults to Entry
    Component: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func,
      PropTypes.object, // type check for React fragments
    ]),
    client: PropTypes.shape({
      query: PropTypes.func,
    }),
    inputAutoComplete: PropTypes.string,
    inputLabel: PropTypes.string,
    inputType: PropTypes.string,
    policyInfo: PropTypes.string,
    tabTitle: PropTypes.string,
  };

  static defaultProps = {
    Component: Entry,
    alternateLoginText: 'Phone',
    inputAutoComplete: 'email',
    inputLabel: 'Email',
    inputType: 'email',
    policyInfo: "You'll enter or create a password to continue.",
    tabTitle: 'Email',
  };

  validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required!'),
  });

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
    const EmailEntryComponent = this.props.Component;

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
              <EmailEntryComponent
                disabled={isSubmitting || !isValid}
                errors={touched.email && errors}
                isLoading={isSubmitting}
                onPressNext={handleSubmit}
                onPressAlternateLogin={this.handleOnPressAlternateLogin}
                setFieldValue={setFieldValue}
                values={values}
                alternateLogin
                {...this.props}
              />
            )}
          </Formik>
        )}
      </LoginConsumer>
    );
  }
}

export default EmailEntryConnected;
