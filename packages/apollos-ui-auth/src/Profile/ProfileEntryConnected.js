/* eslint-disable react/jsx-handler-names */
import React from 'react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';

import { LoginConsumer } from '../LoginProvider';
import ProfileEntry from './ProfileEntry';

const ProfileEntryConnected = ({
  handleForgotPassword,
  screenProps,
  navigation,
}) => (
  <LoginConsumer>
    {({ handleProfileComplete }) => (
      <Formik
        onSubmit={async ({ firstName, lastName }, { setSubmitting }) => {
          setSubmitting(true);
          await handleProfileComplete({
            userProfile: { FirstName: firstName, LastName: lastName },
          });
          setSubmitting(false);
        }}
      >
        {(formikBag) => (
          <ProfileEntry
            {...screenProps}
            {...formikBag}
            errors={formikBag.touched.password && formikBag.errors}
            isLoading={formikBag.isSubmitting}
            onPressNext={formikBag.handleSubmit}
            onPressBack={navigation.goBack}
            handleForgotPassword={handleForgotPassword}
            passwordType="password"
          />
        )}
      </Formik>
    )}
  </LoginConsumer>
);

ProfileEntryConnected.propTypes = {
  navigation: PropTypes.shape({ goBack: PropTypes.func.isRequired }).isRequired,
  emailRequired: PropTypes.bool,
  handleForgotPassword: PropTypes.func,
  screenProps: PropTypes.shape({}),
};

ProfileEntryConnected.defaultProps = {
  emailRequired: true,
};

export default ProfileEntryConnected;
