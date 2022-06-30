import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { TextInput } from '@apollosproject/ui-kit';

import { LegalText, ProfileEntryFieldContainer } from '../styles';

const ProfileEntry = (props) => {
  const LastNameInput = null;
  // const EmailInput = null;
  // const PhoneInput = null;
  return (
    <ProfileEntryFieldContainer {...props}>
      <TextInput
        name="firstName"
        label={'First Name'}
        type={'text'}
        textContentType={'givenName'} // ios autofill
        returnKeyType={'next'}
        value={get(props.values, 'firstName') || ''}
        error={get(props.errors, 'firstName', null)}
        onChangeText={(text) => props.setFieldValue('firstName', text)}
        onSubmitEditing={() => LastNameInput.focus()}
        disabled={props.isLoading}
        enablesReturnKeyAutomatically
      />
      <TextInput
        name="lastName"
        label={'Last Name'}
        type={'text'}
        textContentType={'familyName'} // ios autofill
        returnKeyType={'next'}
        value={get(props.values, 'lastName', '') || ''}
        error={get(props.errors, 'lastName', null)}
        onChangeText={(text) => props.setFieldValue('lastName', text)}
        // onSubmitEditing={() => EmailInput.focus()}
        onSubmitEditing={props.onPressNext}
        disabled={props.isLoading}
        enablesReturnKeyAutomatically
        // inputRef={(r) => {
        //   LastNameInput = r;
        // }}
      />
      <TextInput
        name="email"
        label={'Email'}
        type={'email'}
        textContentType={'emailAddress'} // ios autofill
        returnKeyType={'next'}
        value={get(props.values, 'email')}
        error={get(props.errors, 'email', null)}
        onChangeText={(text) => props.setFieldValue('email', text)}
        // onSubmitEditing={() => PhoneInput.focus()}
        disabled
        enablesReturnKeyAutomatically
        // inputRef={(r) => {
        //   EmailInput = r;
        // }}
      />
      <TextInput
        name="phone"
        label={'Phone Number'}
        type={'phone'}
        textContentType={'telephoneNumber'} // ios autofill
        returnKeyType={'next'}
        value={get(props.values, 'phone')}
        error={get(props.errors, 'phone', null)}
        onChangeText={(text) => props.setFieldValue('phone', text)}
        // onSubmitEditing={props.onPressNext}
        disabled
        enablesReturnKeyAutomatically
        //   inputRef={(r) => {
        //     PhoneInput = r;
        //   }}
      />
    </ProfileEntryFieldContainer>
  );
};

ProfileEntry.propTypes = {
  title: PropTypes.node,
  prompt: PropTypes.string,
  disabled: PropTypes.bool,
  errors: PropTypes.shape({
    phone: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
  onPressNext: PropTypes.func, // used to navigate and/or submit the form
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.shape({
    phone: PropTypes.string,
  }),
  onPressBack: PropTypes.func.isRequired,
};

ProfileEntry.defaultProps = {
  title: 'Complete your profile',
  prompt: null,
};

ProfileEntry.LegalText = LegalText;

ProfileEntry.displayName = 'ProfileEntry';

export default ProfileEntry;
