import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

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
  .add('values', () => (
    <Entry
      setFieldValue={() => {}}
      values={{ phone: 'Boom values.phone boom' }}
    />
  ));
