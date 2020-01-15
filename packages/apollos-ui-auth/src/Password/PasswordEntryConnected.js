/* eslint-disable react/jsx-handler-names */
import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

import { LoginConsumer } from '../LoginProvider';
import PasswordEntry from './PasswordEntry';

const PasswordEntryConnected = ({
  handleForgotPassword,
  screenProps,
  navigation,
}) => (
  <LoginConsumer>
    {({ handleSubmitLogin, newUser }) => (
      <Formik
        validationSchema={Yup.object().shape({
          password: Yup.string().required('Password is required!'),
        })}
        onSubmit={async ({ password }, { setSubmitting, setFieldError }) => {
          setSubmitting(true);
          try {
            await handleSubmitLogin({ password });
          } catch (e) {
            const { graphQLErrors } = e;
            if (
              graphQLErrors &&
              graphQLErrors.length &&
              graphQLErrors.find(
                ({ extensions }) => extensions.code === 'UNAUTHENTICATED'
              )
            ) {
              setFieldError('password', 'Your email or password is incorrect.');
            } else {
              setFieldError(
                'password',
                'Unknown error. Please try again later.'
              );
            }
          }
          setSubmitting(false);
        }}
      >
        {(formikBag) => (
          <PasswordEntry
            {...screenProps}
            {...formikBag}
            errors={formikBag.touched.password && formikBag.errors}
            isLoading={formikBag.isSubmitting}
            onPressNext={formikBag.handleSubmit}
            onPressBack={navigation.goBack}
            handleForgotPassword={handleForgotPassword}
            newUser={newUser}
          />
        )}
      </Formik>
    )}
  </LoginConsumer>
);

PasswordEntryConnected.propTypes = {
  navigation: PropTypes.shape({ goBack: PropTypes.func.isRequired }).isRequired,
  emailRequired: PropTypes.bool,
  handleForgotPassword: PropTypes.func,
  screenProps: PropTypes.shape({}),
};

PasswordEntryConnected.defaultProps = {
  emailRequired: true,
};

export default PasswordEntryConnected;
