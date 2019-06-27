import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { H6 } from '@apollosproject/ui-kit';

import PhoneEntry from './PhoneEntry';

storiesOf('ui-auth/SMS/PhoneEntry', module)
  .add('default', () => <PhoneEntry setFieldValue={() => {}} />)
  .add('alternateLoginText', () => (
    <PhoneEntry
      setFieldValue={() => {}}
      onPressAlternateLogin={() => {}}
      alternateLoginText={
        'Custom Text to direct people to an alternate login flow'
      }
    />
  ))
  .add('authTitleText', () => (
    <PhoneEntry setFieldValue={() => {}} authTitleText={'Custom Title'} />
  ))
  .add('disabled', () => (
    <PhoneEntry setFieldValue={() => {}} onPressNext={() => {}} disabled />
  ))
  .add('errors', () => (
    <PhoneEntry
      setFieldValue={() => {}}
      errors={{ phone: 'Boom errors.phone Boom' }}
    />
  ))
  .add('isLoading', () => (
    <PhoneEntry setFieldValue={() => {}} onPressNext={() => {}} isLoading />
  ))
  .add('onPressAlternateLogin', () => (
    <PhoneEntry setFieldValue={() => {}} onPressAlternateLogin={() => {}} />
  ))
  .add('onPressNext', () => (
    <PhoneEntry setFieldValue={() => {}} onPressNext={() => {}} />
  ))
  .add('smsPolicyInfo', () => (
    <PhoneEntry
      setFieldValue={() => {}}
      smsPolicyInfo={
        <H6 style={{ color: 'salmon' }}>Boom custom legalese boom</H6> // eslint-disable-line react-native/no-inline-styles, react-native/no-color-literals
      }
    />
  ))
  .add('smsPromptText', () => (
    <PhoneEntry
      setFieldValue={() => {}}
      smsPromptText={'Boom custom prompty text boom'}
    />
  ))
  .add('values', () => (
    <PhoneEntry
      setFieldValue={() => {}}
      values={{ phone: 'Boom values.phone boom' }}
    />
  ));
