import React from 'react';
import { storiesOf } from '@storybook/react-native';

import AboutYou from '.';

storiesOf('Onboarding/slides/AboutYou', module)
  .add('default', () => <AboutYou />)
  .add('withImg', () => (
    <AboutYou imgSrc={{ uri: 'https://picsum.photos/1200/1200?random' }} />
  ))
  .add('slideTitle', () => <AboutYou slideTitle={'Custom title text'} />)
  .add('description', () => (
    <AboutYou description={'Custom description text'} />
  ))
  .add('userDOB', () => <AboutYou userDOB={new Date('02/14/1989')} />)
  .add('userGender', () => <AboutYou userGender={'Male'} />)
  .add('genderList', () => <AboutYou genderList={['M', 'F']} />)
  .add('Slide props', () => <AboutYou onPressPrimary={() => {}} />);
