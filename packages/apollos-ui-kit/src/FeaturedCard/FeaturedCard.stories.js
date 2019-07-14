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
  .add('example', () => (
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
      onPressAction={() => {}}
    />
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
  .add('actionIcon', () => (
    <FeaturedCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      image={[
        {
          uri: 'https://picsum.photos/800/1600/?random',
        },
      ]}
      actionIcon={'umbrella'}
      onPressAction={() => {}}
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
  ))
  .add('onPressAction', () => (
    <FeaturedCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      image={[
        {
          uri: 'https://picsum.photos/800/1600/?random',
        },
      ]}
      onPressAction={() => {}}
    />
  ))
  .add('theme.colors.primary', () => (
    <FeaturedCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      image={[
        {
          uri: 'https://picsum.photos/800/1600/?random',
        },
      ]}
      theme={{
        colors: {
          primary: 'salmon',
        },
      }}
    />
  ))
  .add('theme.type.light', () => (
    <FeaturedCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      image={[
        {
          uri: 'https://picsum.photos/800/1600/?random',
        },
      ]}
      theme={{
        type: 'light',
      }}
    />
  ));
