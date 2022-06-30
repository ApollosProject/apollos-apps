import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { TextInput } from '@apollosproject/ui-kit';

import { LegalText, ProfileEntryFieldContainer } from '../styles';

const IdentityConnect = (props) => {
  return (
    <ProfileEntryFieldContainer
      title={`Hey ${props.firstName || 'friend'}`}
      prompt={'Add your phone number to make signing in easier next time.'}
      {...props}
    >
      <TextInput
        name="phone"
        label={'Phone Number'}
        type={'phone'}
        textContentType={'telephoneNumber'} // ios autofill
        returnKeyType={'next'}
        value={get(props.values, 'phone')}
        error={get(props.errors, 'phone', null)}
        onChangeText={(text) => props.setFieldValue('phone', text)}
        onSubmitEditing={props.onPressNext}
        enablesReturnKeyAutomatically
      />
    </ProfileEntryFieldContainer>
  );
};

IdentityConnect.propTypes = {
  firstName: PropTypes.node,
  errors: PropTypes.shape({
    phone: PropTypes.string,
  }),
  onPressNext: PropTypes.func, // used to navigate and/or submit the form
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.shape({
    phone: PropTypes.string,
  }),
};

IdentityConnect.LegalText = LegalText;

IdentityConnect.displayName = 'IdentityConnect';

export default IdentityConnect;
