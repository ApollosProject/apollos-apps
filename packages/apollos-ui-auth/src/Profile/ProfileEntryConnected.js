import React from 'react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';

import ProfileEntry from './ProfileEntry';

const ProfileEntryConnected = ({ handleForgotPassword, screenProps }) => (
  <Formik
    onSubmit={async (
      { firstName, lastName },
      { setSubmitting, setFieldError }
    ) => {
      setSubmitting(true);
      // todo..
    }}
  >
    {(formikBag) => (
      <ProfileEntry
        {...screenProps}
        {...formikBag}
        errors={formikBag.touched.password && formikBag.errors}
        isLoading={formikBag.isSubmitting}
        onPressNext={formikBag.handleSubmit}
        handleForgotPassword={handleForgotPassword}
      />
    )}
  </Formik>
);

ProfileEntryConnected.propTypes = {
  emailRequired: PropTypes.bool,
  handleForgotPassword: PropTypes.func,
  screenProps: PropTypes.shape({}),
};

ProfileEntryConnected.defaultProps = {
  emailRequired: true,
};

export default ProfileEntryConnected;
