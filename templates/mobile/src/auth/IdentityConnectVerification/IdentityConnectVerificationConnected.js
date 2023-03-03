/* eslint-disable react/no-unused-prop-types, react/jsx-handler-names */
import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { LoginContext } from '../LoginProvider';

import { IdentityVerification } from '../Identity';

const IdentityConnectVerificationConnected = (props) => {
  const validationSchema = Yup.object().shape({
    phone: Yup.string().matches(/^[6-9]\d{9}$/),
  });

  const { handleConnectIdentity, closeAuth, code } =
    React.useContext(LoginContext);

  const handleOnSubmit = async (
    { code: formCode },
    { setSubmitting, setFieldError }
  ) => {
    setSubmitting(true);
    try {
      await handleConnectIdentity({
        code: formCode,
      });
      closeAuth();
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
          formType={'phone'} // hardcoded to phone for now
          {...props}
        />
      )}
    </Formik>
  );
};

IdentityConnectVerificationConnected.propTypes = {
  // Custom component to be rendered. Defaults to Verification
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // type check for React fragments
  ]),
};
IdentityConnectVerificationConnected.defaultProps = {
  Component: IdentityVerification,
};

export default IdentityConnectVerificationConnected;
