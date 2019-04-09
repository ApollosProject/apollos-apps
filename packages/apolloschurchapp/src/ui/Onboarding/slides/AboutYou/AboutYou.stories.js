import React from 'react';
import { storiesOf } from '@storybook/react-native';

import AboutYou from '.';

storiesOf('Onboarding/slides/AboutYou', module)
  .add('default', () => <AboutYou />)
  .add('withImg', () => (
    <AboutYou
      imgSrc={{ uri: 'https://picsum.photos/1200/1200?random' }}
      setFieldValue={() => {}}
    />
  ))
  .add('slideTitle', () => (
    <AboutYou slideTitle={'Custom title text'} setFieldValue={() => {}} />
  ))
  .add('description', () => (
    <AboutYou
      description={'Custom description text'}
      setFieldValue={() => {}}
    />
  ))
  .add('userDOB', () => (
    <AboutYou userDOB={new Date('02/14/1989')} setFieldValue={() => {}} />
  ))
  .add('userGender', () => (
    <AboutYou userGender={'Male'} setFieldValue={() => {}} />
  ))
  .add('genderList', () => (
    <AboutYou genderList={['M', 'F']} setFieldValue={() => {}} />
  ))
  .add('Slide props', () => (
    <AboutYou onPressPrimary={() => {}} setFieldValue={() => {}} />
  ));
