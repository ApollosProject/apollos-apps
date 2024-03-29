import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';

import { LoginContext } from '../LoginProvider';
import { AuthContext } from '../Provider';

import Verification from './Verification';

const VerificationConnected = (props) => {
  const navigation = useNavigation();
  const validationSchema = Yup.object().shape({
    phone: Yup.string().matches(/^[6-9]\d{9}$/),
  });

  const { handleValidateLogin, closeAuth, code, authType } =
    React.useContext(LoginContext);
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

  return (
    <Formik
      initialValues={{ code }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={handleOnSubmit}
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
        <Verification
          errors={touched.code && errors}
          disabled={isSubmitting || !isValid}
          isLoading={isSubmitting}
          onPressNext={handleSubmit}
          onPressBack={navigation.goBack}
          setFieldValue={setFieldValue}
          touched={touched}
          values={values}
          formType={authType}
          {...props}
        />
      )}
    </Formik>
  );
};

export default VerificationConnected;
