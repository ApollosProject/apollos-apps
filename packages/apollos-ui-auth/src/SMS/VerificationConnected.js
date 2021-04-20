/* eslint-disable react/no-unused-prop-types, react/jsx-handler-names */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { LoginConsumer } from '../LoginProvider';

import Verification from './Verification';

class VerificationConnected extends Component {
  static propTypes = {
    // Custom component to be rendered. Defaults to Verification
    Component: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func,
      PropTypes.object, // type check for React fragments
    ]),
  };

  static defaultProps = {
    Component: Verification,
  };

  validationSchema = Yup.object().shape({
    phone: Yup.string().matches(/^[6-9]\d{9}$/),
  });

  handleOnSubmit = (handleSubmitLogin) => async (
    { code },
    { setSubmitting, setFieldError }
  ) => {
    setSubmitting(true);
    try {
      await handleSubmitLogin({ password: code });
    } catch (e) {
      console.warn(e);
      setFieldError(
        'code',
        'There was an error. Please double check your number and try again.'
      );
    }
    setSubmitting(false);
  };

  render() {
    const VerificationComponent = this.props.Component;

    return (
      <LoginConsumer>
        {({ handleSubmitLogin }) => (
          <Formik
            initialValues={{ code: '' }}
            validationSchema={this.validationSchema}
            onSubmit={this.handleOnSubmit(handleSubmitLogin)}
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
              <VerificationComponent
                errors={touched.code && errors}
                disabled={isSubmitting || !isValid}
                isLoading={isSubmitting}
                onPressNext={handleSubmit}
                onPressBack={this.props.navigation.goBack}
                setFieldValue={setFieldValue}
                touched={touched}
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

export default VerificationConnected;
