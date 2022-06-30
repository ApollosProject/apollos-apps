/* eslint-disable react/jsx-handler-names */
import React from 'react';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { gql, useQuery } from '@apollo/client';
import { LoginContext } from '../LoginProvider';
import ProfileEntry from './IdentityConnect';

const IdentitySchema = Yup.object().shape({
  phone: Yup.string().nullable(true).min(10).max(11),
});

const IdentityConnectConnected = ({
  navigation,
  identitySchema,
  Component,
}) => {
  const { handleRequestConnectIdentity } = React.useContext(LoginContext);
  const { data, loading } = useQuery(gql`
    query currentUserName {
      currentUser {
        id
        profile {
          firstName
          phone
        }
      }
    }
  `);

  if (loading) {
    return null;
  }

  return (
    <Formik
      initialValues={data?.currentUser?.profile}
      onSubmit={async (fields, { setSubmitting }) => {
        setSubmitting(true);
        await handleRequestConnectIdentity({
          // Just phone for now.
          identity: { phone: fields.phone },
          identityType: 'phone',
        });
        setSubmitting(false);
        navigation.navigate('IdentityConnectVerificationConnected');
      }}
      validationSchema={identitySchema}
      validateOnMount
    >
      {(formikBag) => (
        <Component
          {...formikBag}
          firstName={data?.currentUser?.profile?.firstName}
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

IdentityConnectConnected.propTypes = {
  navigation: PropTypes.shape({ goBack: PropTypes.func.isRequired }).isRequired,
  identitySchema: PropTypes.shape({}),
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // type check for React fragments
  ]),
};

IdentityConnectConnected.defaultProps = {
  identitySchema: IdentitySchema,
  Component: ProfileEntry,
};

export default IdentityConnectConnected;
