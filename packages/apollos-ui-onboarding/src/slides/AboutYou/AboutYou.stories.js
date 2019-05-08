import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { GradientOverlayImage } from '@apollosproject/ui-kit';

import AboutYou from '.';

storiesOf('Onboarding/slides/AboutYou', module)
  .add('default', () => <AboutYou />)
  .add('slideTitle', () => (
    <AboutYou slideTitle={'Custom title text'} setFieldValue={() => {}} />
  ))
  .add('description', () => (
    <AboutYou
      description={'Custom description text'}
      setFieldValue={() => {}}
    />
  ))
  .add('genderList', () => (
    <AboutYou genderList={['M', 'F']} setFieldValue={() => {}} />
  ))
  .add('values – birthDate', () => (
    <AboutYou values={{ birthDate: '1989-02-14' }} setFieldValue={() => {}} />
  ))
  .add('values – gender', () => (
    <AboutYou values={{ gender: 'Male' }} setFieldValue={() => {}} />
  ))
  .add('BackgroundComponent', () => (
    <AboutYou
      BackgroundComponent={
        <GradientOverlayImage
          source={'https://picsum.photos/640/640/?random'}
        />
      }
      setFieldValue={() => {}}
    />
  ))
  .add('Slide props', () => (
    <AboutYou onPressPrimary={() => {}} setFieldValue={() => {}} />
  ));
