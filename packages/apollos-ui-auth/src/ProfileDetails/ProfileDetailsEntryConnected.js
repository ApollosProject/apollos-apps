import React from 'react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { withTheme } from '@apollosproject/ui-kit';

import { LoginConsumer } from '../LoginProvider';
import ProfileEntry from './ProfileDetailsEntry';

const ProfileDetailsSchema = Yup.object().shape({
  gender: Yup.string().required('Required'),
  birthDate: Yup.date().required('Required'),
});

const ProfileDetailsEntryConnected = ({ Component }) => (
  <LoginConsumer>
    {({ handleProfileComplete }) => (
      <Formik
        onSubmit={async ({ gender, birthDate }, { setSubmitting }) => {
          setSubmitting(true);
          await handleProfileComplete({
            userProfile: { Gender: gender, BirthDate: birthDate },
          });
          setSubmitting(false);
        }}
        validationSchema={ProfileDetailsSchema}
      >
        {(formikBag) => (
          <Component
            {...formikBag}
            errors={formikBag.errors}
            disabled={!formikBag.isValid}
            isLoading={formikBag.isSubmitting}
            onPressNext={formikBag.handleSubmit}
          />
        )}
      </Formik>
    )}
  </LoginConsumer>
);

ProfileDetailsEntryConnected.propTypes = {
  navigation: PropTypes.shape({ goBack: PropTypes.func.isRequired }).isRequired,
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // type check for React fragments
  ]),
};

ProfileDetailsEntryConnected.defaultProps = {
  Component: ProfileEntry,
};

export default withTheme(
  () => ({}),
  'ui-auth.ProfileDetailsEntryConnected'
)(ProfileDetailsEntryConnected);
