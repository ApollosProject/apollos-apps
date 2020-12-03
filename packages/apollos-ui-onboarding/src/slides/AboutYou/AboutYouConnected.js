import React, { memo } from 'react';
import { Query, Mutation } from '@apollo/client/react/components';
import { Formik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { isNil, isEmpty } from 'lodash';

import GET_USER_GENDER_AND_BIRTH_DATE from './getUserGenderAndBirthDate';
import AboutYou from './AboutYou';

import UPDATE_USER_DETAILS from './updateUserDetails';

const ROCK_GENDERS = ['Male', 'Female'];

const AboutYouConnected = memo(
  ({ Component, onPressPrimary, onPressSecondary, ...props }) => (
    <Query query={GET_USER_GENDER_AND_BIRTH_DATE}>
      {({ data: { currentUser = { profile: {} } } = {}, loading = false }) => {
        const { gender, birthDate } = currentUser.profile;

        return (
          <Mutation mutation={UPDATE_USER_DETAILS}>
            {(updateDetails) => (
              <Formik
                initialValues={{
                  gender: gender === 'Unknown' ? 'Prefer not to reply' : gender,
                  birthDate,
                }}
                isInitialValid={() =>
                  !!(
                    ['Male', 'Female', 'Prefer not to reply'].includes(
                      gender
                    ) || birthDate
                  )
                } // isInitialValid defaults to `false` this correctly checks for user data
                validationSchema={Yup.object().shape({
                  gender: Yup.string().oneOf([
                    'Male',
                    'Female',
                    'Prefer not to reply',
                  ]),
                  birthDate: Yup.string().nullable(),
                })}
                enableReinitialize
                onSubmit={async (
                  variables,
                  { setSubmitting, setFieldError }
                ) => {
                  try {
                    const input = [];
                    if (ROCK_GENDERS.includes(variables.gender)) {
                      input.push({ field: 'Gender', value: variables.gender });
                    } else if (variables.gender === 'Prefer not to reply') {
                      input.push({ field: 'Gender', value: 'Unknown' });
                    }
                    if (!isNil(variables.birthDate)) {
                      input.push({
                        field: 'BirthDate',
                        value: variables.birthDate,
                      });
                    }
                    if (!isEmpty(input)) {
                      await updateDetails({ variables: { input } });
                    }
                    onPressPrimary(); // advance to the next slide after submission
                  } catch (e) {
                    const { graphQLErrors } = e;
                    if (
                      graphQLErrors.length &&
                      graphQLErrors.find(({ message }) =>
                        message.includes('Invalid')
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
                {({
                  isValid,
                  isSubmitting,
                  submitForm,
                  values,
                  touched,
                  errors,
                  setFieldValue,
                }) => (
                  <Component
                    onPressPrimary={isValid ? submitForm : null} // if form `isValid` show the primary nav button (next)
                    onPressSecondary={
                      // if form `!isValid` show the secondary nav button (skip)
                      isValid ? null : onPressSecondary || onPressPrimary // if onPressSecondary exists use it else default onPressPrimary
                    }
                    pressPrimaryEventName={'About You Completed'}
                    pressSecondaryEventName={'About You Skipped'}
                    gender={gender}
                    birthDate={birthDate}
                    values={values}
                    touched={touched}
                    errors={errors}
                    setFieldValue={setFieldValue}
                    isLoading={loading || isSubmitting}
                    {...props}
                  />
                )}
              </Formik>
            )}
          </Mutation>
        );
      }}
    </Query>
  )
);

AboutYouConnected.propTypes = {
  // Custom component to be rendered. Defaults to AboutYou
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object,
  ]),
  onPressPrimary: PropTypes.func,
  onPressSecondary: PropTypes.func,
};

AboutYouConnected.defaultProps = {
  Component: AboutYou,
};

AboutYouConnected.displayName = 'AboutYouConnected';

export default AboutYouConnected;
