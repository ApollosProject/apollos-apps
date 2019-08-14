import React from 'react';
import { Mutation, ApolloConsumer } from 'react-apollo';
import { Formik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

import { AnalyticsConsumer } from '@apollosproject/ui-analytics';

import handleLogin from '../../handleLogin';
import REGISTER_PERSON from './registerPerson';
import SignupForm from './Form';

const Signup = ({ onSignup, emailRequired }) => {
  const emailSchema = emailRequired
    ? Yup.string()
        .email('Invalid email address')
        .required('Email is required!')
    : Yup.string().required('Email is required!');
  return (
    <ApolloConsumer>
      {(client) => (
        <AnalyticsConsumer>
          {({ track }) => (
            <Mutation
              mutation={REGISTER_PERSON}
              update={(cache, { data: { registerPerson } }) => {
                track({ eventName: 'UserSignup' });
                client.mutate({
                  mutation: handleLogin,
                  variables: {
                    authToken: registerPerson.token,
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
                  onSubmit={async (
                    variables,
                    { setSubmitting, setFieldError }
                  ) => {
                    try {
                      await authenticate({ variables });
                      // track({ eventName: events.UserSignup }); // TODO: Move signup logic to store/index and move tracking logic there also.
                      if (onSignup) onSignup();
                    } catch ({ graphQLErrors = [], ...e }) {
                      if (
                        graphQLErrors.length &&
                        graphQLErrors.find(({ message }) =>
                          message.includes('User already exists')
                        )
                      ) {
                        setFieldError(
                          'email',
                          'There is already a user with this email'
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
                  {(formikBag) => <SignupForm {...formikBag} />}
                </Formik>
              )}
            </Mutation>
          )}
        </AnalyticsConsumer>
      )}
    </ApolloConsumer>
  );
};

Signup.propTypes = {
  onSignup: PropTypes.func,
  emailRequired: PropTypes.bool,
};

Signup.defaultProps = {
  emailRequired: true,
};
export default Signup;
