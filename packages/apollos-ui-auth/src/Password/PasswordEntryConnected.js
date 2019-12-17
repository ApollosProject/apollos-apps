import React from 'react';
import { Mutation, ApolloConsumer } from 'react-apollo';
import { Formik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

import handleLogin from '../handleLogin';
import { AuthConsumer } from '../Provider';
import AUTHENTICATE from './authenticate';
import PasswordEntry from './PasswordEntry';

const PasswordEntryConnected = ({
  navigation: {
    state: { params },
  },
  handleForgotPassword,
  screenProps,
}) => (
  <AuthConsumer>
    {({ closeAuth }) => (
      <ApolloConsumer>
        {(client) => (
          <Mutation
            mutation={AUTHENTICATE}
            update={(cache, { data: { authenticate } }) => {
              client.mutate({
                mutation: handleLogin,
                variables: {
                  authToken: authenticate.token,
                },
              });
            }}
          >
            {(authenticate) => (
              <Formik
                validationSchema={Yup.object().shape({
                  password: Yup.string().required('Password is required!'),
                })}
                onSubmit={async (
                  { password },
                  { setSubmitting, setFieldError }
                ) => {
                  setSubmitting(true);
                  try {
                    await authenticate({
                      variables: { email: params.email, password },
                    });
                    closeAuth();
                  } catch (e) {
                    const { graphQLErrors } = e;
                    if (
                      graphQLErrors &&
                      graphQLErrors.length &&
                      graphQLErrors.find(
                        ({ extensions }) =>
                          extensions.code === 'UNAUTHENTICATED'
                      )
                    ) {
                      setFieldError(
                        'password',
                        'Your email or password is incorrect.'
                      );
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
                    handleForgotPassword={handleForgotPassword}
                  />
                )}
              </Formik>
            )}
          </Mutation>
        )}
      </ApolloConsumer>
    )}
  </AuthConsumer>
);

PasswordEntryConnected.propTypes = {
  emailRequired: PropTypes.bool,
  handleForgotPassword: PropTypes.func,
  screenProps: PropTypes.shape({}),
};

PasswordEntryConnected.defaultProps = {
  emailRequired: true,
};

export default PasswordEntryConnected;
