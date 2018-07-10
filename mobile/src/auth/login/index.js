import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Formik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

import LoginForm from './Form';

const authenticateMutation = gql`
  mutation authenticate($email: String!, $password: String!) {
    authenticate(identity: $email, password: $password) {
      token
    }
  }
`;

const getAuthToken = gql`
  query authToken {
    authToken @client
  }
`;

const Login = ({ onLogin }) => (
  <Mutation
    mutation={authenticateMutation}
    update={(cache, { data: { authenticate } }) => {
      cache.writeQuery({
        query: getAuthToken,
        data: { authToken: authenticate.token },
      });
    }}
  >
    {(authenticate) => (
      <Formik
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email('Invalid email address')
            .required('Email is required!'),
          password: Yup.string().required('Password is required!'),
        })}
        onSubmit={async (variables, { setSubmitting, setFieldError }) => {
          try {
            await authenticate({ variables });
          } catch ({ graphQLErrors = [], ...e }) {
            if (
              graphQLErrors.length &&
              graphQLErrors.find(
                ({ extensions }) => extensions.code === 'UNAUTHENTICATED'
              )
            ) {
              setFieldError('email', true);
              setFieldError('password', 'Your email or password is incorrect.');
            } else {
              setFieldError(
                'password',
                'Unknown error. Please try again later.'
              );
            }
          }
          setSubmitting(false);
          if (onLogin) onLogin();
        }}
      >
        {(formikBag) => <LoginForm {...formikBag} />}
      </Formik>
    )}
  </Mutation>
);

Login.propTypes = {
  onLogin: PropTypes.func,
};

export default Login;
