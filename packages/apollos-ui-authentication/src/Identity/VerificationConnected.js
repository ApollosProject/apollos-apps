/* eslint-disable react/no-unused-prop-types, react/jsx-handler-names */
import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { LoginContext } from '../LoginProvider';
import { AuthContext } from '../Provider';

import Verification from './Verification';

const VerificationConnected = (props) => {
  const validationSchema = Yup.object().shape({
    phone: Yup.string().matches(/^[6-9]\d{9}$/),
  });

  const { handleValidateLogin, closeAuth, newUser, code } = React.useContext(
    LoginContext
  );
  const { login } = React.useContext(AuthContext);

  const handleOnSubmit = async (
    { code: formCode },
    { setSubmitting, setFieldError }
  ) => {
    setSubmitting(true);
    try {
      const { accessToken, refreshToken } = await handleValidateLogin({
        code: formCode,
      });
      await login({ accessToken, refreshToken });
      if (newUser) {
        props.navigation.navigate('OpenIDConnected');
      } else {
        closeAuth();
      }
    } catch (e) {
      console.warn(e);
      setFieldError(
        'code',
        'There was an error. Please double check your number and try again.'
      );
    }
    setSubmitting(false);
  };

  const VerificationComponent = props.Component;

  return (
    <Formik
      initialValues={{ code }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={handleOnSubmit}
      isInitialValid={() => !!code}
      validateOnMount
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
          onPressBack={props.navigation.goBack}
          setFieldValue={setFieldValue}
          touched={touched}
          values={values}
          {...props}
        />
      )}
    </Formik>
  );
};

VerificationConnected.propTypes = {
  // Custom component to be rendered. Defaults to Verification
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // type check for React fragments
  ]),
};
VerificationConnected.defaultProps = {
  Component: Verification,
};

export default VerificationConnected;
