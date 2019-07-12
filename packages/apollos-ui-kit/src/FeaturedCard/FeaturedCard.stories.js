import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import BackgroundView from '../BackgroundView';
import CenteredView from '../CenteredView';

import FeaturedCard from '.';

storiesOf('ui-kit/FeaturedCard', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'stretch' }}>{story()}</CenteredView>
    </BackgroundView>
  ))
  .add('default', () => (
    <FeaturedCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      image={[
        {
          uri: 'https://picsum.photos/800/1600/?random',
        },
      ]}
    />
  ))
  .add('description', () => (
    <FeaturedCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      image={[
        {
          uri: 'https://picsum.photos/800/1600/?random',
        },
      ]}
      description={
        'The way I see it, if you’re going to build a time machine into a car, why not do it with some style?'
      }
    />
  ));
