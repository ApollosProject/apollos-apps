/* eslint-disable react/jsx-handler-names */
import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import ApollosConfig from '@apollosproject/config';

import { LoginConsumer } from '../LoginProvider';
import PasswordEntry from './PasswordEntry';

const { APP_DATA_URL } = ApollosConfig;

const PasswordEntryConnected = ({
  navigation,
  route: {
    params: {
      forgotPasswordURL = `${new URL('/forgot-password', APP_DATA_URL)}`,
    },
  },
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
            {...formikBag}
            errors={formikBag.touched.password && formikBag.errors}
            isLoading={formikBag.isSubmitting}
            onPressNext={formikBag.handleSubmit}
            onPressBack={navigation.goBack}
            forgotPasswordURL={forgotPasswordURL}
            newUser={newUser}
          />
        )}
      </Formik>
    )}
  </LoginConsumer>
);

PasswordEntryConnected.propTypes = {
  navigation: PropTypes.shape({ goBack: PropTypes.func.isRequired }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({ forgotPasswordURL: PropTypes.string }),
  }),
};

export default PasswordEntryConnected;
