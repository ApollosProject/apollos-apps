import React, { memo } from 'react';
import { Query, Mutation } from 'react-apollo';
import { Formik } from 'formik';
import * as Yup from 'yup';

import getUserProfile from '../../../../tabs/connect/getUserProfile';
import AboutYou from './AboutYou';

import updateUserDetails from './updateUserDetails';

// eslint-disable-next-line react/display-name
const AskNameConnected = memo((props) => (
  <Query query={getUserProfile}>
    {({ data: { currentUser = { profile: {} } } = {} }) => {
      const { gender, birthDate } = currentUser.profile;
      return (
        <Mutation
          mutation={updateUserDetails}
          update={async (cache, { data: { updateProfileFields } }) => {
            await cache.writeQuery({
              query: getUserProfile,
              data: {
                currentUser: {
                  ...currentUser,
                  profile: {
                    ...currentUser.profile,
                    gender: updateProfileFields.gender,
                    birthDate: updateProfileFields.birthDate,
                  },
                },
              },
            });
          }}
        >
          {(updateDetails) => (
            <Formik
              initialValues={{ gender, birthDate }}
              validationSchema={Yup.object().shape({
                gender: Yup.enum().required('Gender is required!'),
                birthDate: Yup.string().required('Birth Date is required!'),
              })}
              onSubmit={async (variables, { setSubmitting, setFieldError }) => {
                try {
                  await updateDetails({ variables });
                } catch (e) {
                  const { graphQLErrors } = e;
                  if (
                    graphQLErrors.length &&
                    graphQLErrors.find(({ message }) =>
                      message.includes('User already exists')
                    )
                  ) {
                    setFieldError(
                      'gender',
                      'There was a problem sending your request'
                    );
                  } else {
                    setFieldError(
                      'gender',
                      'Unknown error. Please try again later.'
                    );
                  }
                }
                setSubmitting(false);
              }}
            >
              {(formikBag) => <AboutYou {...formikBag} {...props} />}
            </Formik>
          )}
        </Mutation>
      );
    }}
  </Query>
));

export default AskNameConnected;
