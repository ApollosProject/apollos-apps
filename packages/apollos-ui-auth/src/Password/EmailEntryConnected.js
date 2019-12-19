/* eslint-disable react/no-unused-prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { withApollo } from 'react-apollo';

import GET_USER_EXISTS from '../getUserExists';
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
    screenProps: PropTypes.shape({}), // we'll funnel screenProps into props
    inputAutoComplete: PropTypes.string,
    inputLabel: PropTypes.string,
    inputType: PropTypes.string,
    policyInfo: PropTypes.string,
    tabTitle: PropTypes.string,
  };

  static defaultProps = {
    Component: Entry,
    screenProps: {},
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

  flatProps = { ...this.props, ...this.props.screenProps };

  handleOnSubmit = async ({ email }, { setSubmitting, setFieldError }) => {
    console.log('email.handleOnSubmit', { email });
    setSubmitting(true);
    try {
      const {
        data: { userExists },
      } = await this.props.client.query({
        query: GET_USER_EXISTS,
        variables: { identity: email },
        fetchPolicy: 'network-only',
      });

      if (userExists === 'EXISTING_APP_USER') {
        this.props.navigation.navigate('AuthPasswordEntryConnected', {
          email,
        });
      } else {
        this.props.navigation.navigate('AuthProfileEntryConnected', {
          email,
        });
      }
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
      <Formik
        initialValues={{ email: '' }}
        validationSchema={this.validationSchema}
        onSubmit={this.handleOnSubmit}
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
            alternateLogin
            {...this.flatProps}
          />
        )}
      </Formik>
    );
  }
}

export default withApollo(EmailEntryConnected);
