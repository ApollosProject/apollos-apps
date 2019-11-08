import React from 'react';
import { Mutation, ApolloConsumer } from 'react-apollo';
import { Formik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

import handleLogin from '../../handleLogin';
import AUTHENTICATE from './authenticate';
import LoginForm from './Form';

const Login = ({ onLogin, emailRequired, handleForgotPassword }) => {
  const emailSchema = emailRequired
    ? Yup.string()
        .email('Invalid email address')
        .required('Email is required!')
    : Yup.string().required('Email is required!');
  return (
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
                email: emailSchema,
                password: Yup.string().required('Password is required!'),
              })}
              onSubmit={async (variables, { setSubmitting, setFieldError }) => {
                try {
                  await authenticate({ variables });
                  if (onLogin) onLogin();
                } catch (e) {
                  const { graphQLErrors } = e;
                  if (
                    graphQLErrors.length &&
                    graphQLErrors.find(
                      ({ extensions }) => extensions.code === 'UNAUTHENTICATED'
                    )
                  ) {
                    setFieldError('email', true);
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
                <LoginForm
                  {...formikBag}
                  handleForgotPassword={handleForgotPassword}
                />
              )}
            </Formik>
          )}
        </Mutation>
      )}
    </ApolloConsumer>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func,
  emailRequired: PropTypes.bool,
  handleForgotPassword: PropTypes.func,
};

Login.defaultProps = {
  emailRequired: true,
};

export default Login;
