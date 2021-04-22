/* eslint-disable react/no-unused-prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { LoginConsumer } from '../LoginProvider';
import Entry from '../Entry';

class PhoneEntryConnected extends Component {
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
    alternateLoginText: 'Email',
    inputAutoComplete: 'tel',
    inputLabel: 'Phone Number',
    inputType: 'phone',
    policyInfo: "We'll text you a code to make login super easy!",
    tabTitle: 'Phone',
  };

  validationSchema = Yup.object().shape({
    phone: Yup.string().matches(
      /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/,
      'Your phone number appears to be invalid'
    ),
  });

  handleOnSubmit = (handleCheckUserExists) => async (
    { phone },
    { setSubmitting, setFieldError }
  ) => {
    setSubmitting(true);
    try {
      await handleCheckUserExists({ authType: 'sms', identity: phone });
    } catch (e) {
      console.warn(e);
      setFieldError(
        'phone',
        'There was an error. Please double check your number and try again.'
      );
    }
    setSubmitting(false);
  };

  handleOnPressAlternateLogin = () => {
    this.props.navigation.replace('AuthEmailEntryConnected');
  };

  render() {
    const PhoneEntryComponent = this.props.Component;

    return (
      <LoginConsumer>
        {({ handleCheckUserExists }) => (
          <Formik
            initialValues={{ phone: '' }}
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
              <PhoneEntryComponent
                disabled={isSubmitting || !isValid}
                errors={touched.phone && errors}
                isLoading={isSubmitting}
                onPressNext={handleSubmit}
                onPressAlternateLogin={this.handleOnPressAlternateLogin}
                setFieldValue={setFieldValue}
                values={values}
                {...this.props}
              />
            )}
          </Formik>
        )}
      </LoginConsumer>
    );
  }
}

export default PhoneEntryConnected;
