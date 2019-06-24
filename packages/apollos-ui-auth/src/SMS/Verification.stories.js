import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import Verification from './Verification';

storiesOf('ui-auth/SMS/Verification', module)
  .add('default', () => <Verification setFieldValue={() => {}} />)
  .add('confirmationTitleText', () => (
    <Verification
      setFieldValue={() => {}}
      confirmationTitleText={'A Custom Title'}
    />
  ))
  .add('confirmationPromptText', () => (
    <Verification
      setFieldValue={() => {}}
      confirmationPromptText={'Boom custom prompty text boom'}
    />
  ))
  .add('disabled', () => (
    <Verification setFieldValue={() => {}} onPressNext={() => {}} disabled />
  ))
  .add('errors', () => (
    <Verification
      setFieldValue={() => {}}
      errors={{ code: 'Boom errors.code Boom' }}
    />
  ))
  .add('isLoading', () => (
    <Verification setFieldValue={() => {}} onPressNext={() => {}} isLoading />
  ))
  .add('onPressNext', () => (
    <Verification setFieldValue={() => {}} onPressNext={() => {}} />
  ))
  .add('values', () => (
    <Verification
      setFieldValue={() => {}}
      values={{ code: 'Boom values.code boom' }}
    />
  ));
