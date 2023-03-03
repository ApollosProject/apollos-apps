import React, { useEffect } from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { ButtonLink } from '@apollosproject/ui-kit';
import { LoginContext } from '../LoginProvider';
import { ButtonLinkText } from '../styles';
import IdentityEntry from './IdentityEntry';

function IdentityEntryConnected(props) {
  const validationSchema = Yup.object().shape({
    phone: Yup.string().matches(
      /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/,
      'Your phone number appears to be invalid'
    ),
    email: Yup.string().email(),
  });

  const {
    authType,
    toggleAuthType,
    handleRequestLogin,
    handleRequestRegister,
    setNewUser,
    newUser,
    identity,
  } = React.useContext(LoginContext);

  useEffect(() => {
    if (props?.route?.params?.newUser != null) {
      setNewUser(props?.route?.params?.newUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnSubmit = async (
    formIdentity,
    { setSubmitting, setFieldError, setFieldTouched }
  ) => {
    setSubmitting(true);
    try {
      if (!newUser) {
        const { result } = await handleRequestLogin({ identity: formIdentity });
        if (result === 'SUCCESS') {
          props.navigation.navigate('IdentityVerificationConnected');
        }
        if (result === 'NO_USER') {
          setFieldError(
            authType,
            <>
              <Text>{"We can't find your account. Did you mean to "}</Text>
              <ButtonLink
                onPress={() => {
                  setFieldError(authType, null);
                  setFieldTouched(authType, true);
                  setNewUser(true);
                }}
              >
                <ButtonLinkText>register? </ButtonLinkText>
              </ButtonLink>
            </>
          );
        }
      } else {
        const { result } = await handleRequestRegister({
          identity: formIdentity,
        });
        if (result === 'SUCCESS') {
          props.navigation.navigate('IdentityVerificationConnected');
        }
        if (result === 'EXISTING_USER') {
          setFieldError(
            authType,
            <>
              <Text>
                {'Looks like you already have a user account. Did you mean to '}
              </Text>
              <ButtonLink
                onPress={() => {
                  setFieldError(authType, null);
                  setFieldTouched(authType, true);
                  setNewUser(false);
                }}
              >
                <ButtonLinkText>log in?</ButtonLinkText>
              </ButtonLink>
            </>
          );
        }
      }
    } catch (e) {
      console.warn(e);
      setFieldError(
        authType,
        'There was an error. Please double check your input and try again.'
      );
    }
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{ phone: '', email: '', ...identity }}
      validationSchema={validationSchema}
      onSubmit={handleOnSubmit}
      // validateOnMount
    >
      {({
        setFieldValue,
        handleSubmit,
        values,
        isSubmitting,
        isValid,
        touched,
        errors,
      }) => (
        <IdentityEntry
          disabled={isSubmitting || !isValid}
          errors={touched.phone && errors}
          isLoading={isSubmitting}
          onPressNext={handleSubmit}
          onPressAlternateLogin={toggleAuthType}
          onChangeNewUser={setNewUser}
          newUser={newUser}
          setFieldValue={setFieldValue}
          values={values}
          formType={authType}
          authTitleText={newUser ? "We're glad you're here." : 'Welcome back!'}
          promptText={
            newUser
              ? 'If you’ve attended with us before, we’ll sync your history and help personalize what’s next.'
              : 'Use the same phone number or email that you used when logging into the app before.'
          }
          {...props}
        />
      )}
    </Formik>
  );
}

IdentityEntryConnected.propTypes = {
  alternateLoginText: PropTypes.string,
  client: PropTypes.shape({
    query: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      newUser: PropTypes.bool,
    }),
  }),
  inputAutoComplete: PropTypes.string,
  inputLabel: PropTypes.string,
  inputType: PropTypes.string,
  policyInfo: PropTypes.string,
  tabTitle: PropTypes.string,
};

export default IdentityEntryConnected;
