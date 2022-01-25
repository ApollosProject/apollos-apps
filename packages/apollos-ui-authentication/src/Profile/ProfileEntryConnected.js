/* eslint-disable react/jsx-handler-names */
import React from 'react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { gql, useQuery, useMutation } from '@apollo/client';
import { startCase } from 'lodash';
import { LoginContext } from '../LoginProvider';
import ProfileEntry from './ProfileEntry';

const ProfileSchema = Yup.object().shape({
  firstName: Yup.string().required('Required').nullable(),
  lastName: Yup.string().required('Required').nullable(),
  phone: Yup.string().nullable(true).min(10).max(11),
  email: Yup.string().nullable(true),
});

const ProfileEntryConnected = ({ navigation, profileSchema, Component }) => {
  const { closeAuth } = React.useContext(LoginContext);
  const { data, loading } = useQuery(gql`
    query currentUser {
      currentUser {
        id
        profile {
          firstName
          lastName
          email
          phone
        }
      }
    }
  `);

  const [updateProfile] = useMutation(gql`
    mutation updatProfile($input: [UpdateProfileInput]!) {
      updateProfileFields(input: $input) {
        firstName
        lastName
        email
        phone
        id
      }
    }
  `);

  if (loading) return null;

  return (
    <Formik
      initialValues={data?.currentUser?.profile}
      initialTouched={{ phone: true, email: true }}
      onSubmit={async (fields, { setSubmitting }) => {
        setSubmitting(true);
        const validKeys = ['firstName', 'lastName', 'phone', 'email'];
        const mapUserInput = Object.keys(fields)
          .filter((key) => validKeys.includes(key) && !!fields[key])
          .map((key) => ({
            field: startCase(key).split(' ').join(''),
            value: fields[key],
          }));

        await updateProfile({
          variables: { input: mapUserInput },
        });
        setSubmitting(false);
        closeAuth();
      }}
      validationSchema={profileSchema}
      validateOnMount
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
  );
};

ProfileEntryConnected.propTypes = {
  navigation: PropTypes.shape({ goBack: PropTypes.func.isRequired }).isRequired,
  profileSchema: PropTypes.shape({}),
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // type check for React fragments
  ]),
};

ProfileEntryConnected.defaultProps = {
  profileSchema: ProfileSchema,
  Component: ProfileEntry,
};

export default ProfileEntryConnected;
