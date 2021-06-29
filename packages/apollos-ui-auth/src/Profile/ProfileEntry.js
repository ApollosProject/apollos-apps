import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { TextInput } from '@apollosproject/ui-kit';

import { LegalText, ProfileEntryFieldContainer } from '../styles';

const ProfileEntry = (props) => {
  let LastNameInput = null;
  return (
    <ProfileEntryFieldContainer {...props}>
      <TextInput
        name="firstName"
        label={'First Name'}
        type={'text'}
        textContentType={'givenName'} // ios autofill
        returnKeyType={'next'}
        value={get(props.values, 'firstName')}
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
        value={get(props.values, 'lastName')}
        error={get(props.errors, 'lastName', null)}
        onChangeText={(text) => props.setFieldValue('lastName', text)}
        onSubmitEditing={props.onPressNext}
        disabled={props.isLoading}
        enablesReturnKeyAutomatically
        inputRef={(r) => {
          LastNameInput = r;
        }}
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
  title: 'Welcome!',
  prompt:
    'Every relationship starts with a name. Complete your profile to help us connect with you.',
};

ProfileEntry.LegalText = LegalText;

ProfileEntry.displayName = 'ProfileEntry';

export default ProfileEntry;
