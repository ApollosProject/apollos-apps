/* eslint-disable react/jsx-handler-names */
import React from 'react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import { LoginConsumer } from '../LoginProvider';
import ProfileEntry from './ProfileEntry';

const ProfileSchema = Yup.object().shape({
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
});

const ProfileEntryConnected = ({ navigation, profileSchema, Component }) => (
  <LoginConsumer>
    {({ handleUpdateProfile }) => (
      <Formik
        onSubmit={async ({ firstName, lastName }, { setSubmitting }) => {
          setSubmitting(true);
          await handleUpdateProfile({
            userProfile: { FirstName: firstName, LastName: lastName },
          });
          setSubmitting(false);
        }}
        validationSchema={profileSchema}
      >
        {(formikBag) => (
          <Component
            {...formikBag}
            disabled={!formikBag.isValid}
            errors={formikBag.errors}
            isLoading={formikBag.isSubmitting}
            onPressNext={formikBag.handleSubmit}
            onPressBack={navigation.goBack}
          />
        )}
      </Formik>
    )}
  </LoginConsumer>
);

ProfileEntryConnected.propTypes = {
  navigation: PropTypes.shape({ goBack: PropTypes.func.isRequired }).isRequired,
  emailRequired: PropTypes.bool,
  profileSchema: PropTypes.shape({}),
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // type check for React fragments
  ]),
};

ProfileEntryConnected.defaultProps = {
  emailRequired: true,
  profileSchema: ProfileSchema,
  Component: ProfileEntry,
};

export default ProfileEntryConnected;
