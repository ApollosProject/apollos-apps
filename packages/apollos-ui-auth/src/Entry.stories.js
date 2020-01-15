import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { H6 } from '@apollosproject/ui-kit';

import Entry from './Entry';

storiesOf('ui-auth/Entry', module)
  .add('default', () => <Entry setFieldValue={() => {}} />)
  .add('alternateLoginText', () => (
    <Entry
      setFieldValue={() => {}}
      onPressAlternateLogin={() => {}}
      alternateLoginText={
        'Custom Text to direct people to an alternate login flow'
      }
    />
  ))
  .add('authTitleText', () => (
    <Entry setFieldValue={() => {}} authTitleText={'Custom Title'} />
  ))
  .add('disabled', () => (
    <Entry setFieldValue={() => {}} onPressNext={() => {}} disabled />
  ))
  .add('errors', () => (
    <Entry
      setFieldValue={() => {}}
      errors={{ phone: 'Boom errors.phone Boom' }}
    />
  ))
  .add('isLoading', () => (
    <Entry setFieldValue={() => {}} onPressNext={() => {}} isLoading />
  ))
  .add('onPressAlternateLogin', () => (
    <Entry setFieldValue={() => {}} onPressAlternateLogin={() => {}} />
  ))
  .add('onPressNext', () => (
    <Entry setFieldValue={() => {}} onPressNext={() => {}} />
  ))
  .add('smsPolicyInfo', () => (
    <Entry
      setFieldValue={() => {}}
      smsPolicyInfo={
        <H6 style={{ color: 'salmon' }}>Boom custom legalese boom</H6> // eslint-disable-line react-native/no-inline-styles, react-native/no-color-literals
      }
    />
  ))
  .add('smsPromptText', () => (
    <Entry
      setFieldValue={() => {}}
      smsPromptText={'Boom custom prompty text boom'}
    />
  ))
  .add('values', () => (
    <Entry
      setFieldValue={() => {}}
      values={{ phone: 'Boom values.phone boom' }}
    />
  ));
