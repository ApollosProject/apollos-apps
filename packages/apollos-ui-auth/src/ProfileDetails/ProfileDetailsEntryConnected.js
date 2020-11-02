/* eslint-disable react/jsx-handler-names */
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

const ProfileDetailsEntryConnected = ({
  screenProps,
  navigation,
  Component,
}) => (
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
            {...screenProps}
            {...formikBag}
            errors={formikBag.errors}
            disabled={!formikBag.isValid}
            isLoading={formikBag.isSubmitting}
            onPressNext={formikBag.handleSubmit}
            onPressBack={navigation.goBack}
          />
        )}
      </Formik>
    )}
  </LoginConsumer>
);

ProfileDetailsEntryConnected.propTypes = {
  navigation: PropTypes.shape({ goBack: PropTypes.func.isRequired }).isRequired,
  emailRequired: PropTypes.bool,
  screenProps: PropTypes.shape({}),
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // type check for React fragments
  ]),
};

ProfileDetailsEntryConnected.defaultProps = {
  emailRequired: true,
  Component: ProfileEntry,
};

export default withTheme(() => ({}), 'ui-auth.ProfileDetailsEntryConnected')(
  ProfileDetailsEntryConnected
);
