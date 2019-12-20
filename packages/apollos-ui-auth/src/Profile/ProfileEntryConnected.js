import React from 'react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';

import { LoginConsumer } from '../LoginProvider';
import ProfileEntry from './ProfileEntry';

const ProfileEntryConnected = ({ handleForgotPassword, screenProps }) => (
  <LoginConsumer>
    {({ handleProfileComplete }) => (
      <Formik
        onSubmit={async ({ firstName, lastName }, { setSubmitting }) => {
          setSubmitting(true);
          handleProfileComplete({
            userProfile: { FirstName: firstName, LastName: lastName },
          });
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
            passwordType="password"
          />
        )}
      </Formik>
    )}
  </LoginConsumer>
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
