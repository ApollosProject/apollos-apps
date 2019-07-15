import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import BackgroundView from '../BackgroundView';
import CenteredView from '../CenteredView';

import HighlightCard from '.';

storiesOf('ui-kit/HighlightCard', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'stretch' }}>{story()}</CenteredView>
    </BackgroundView>
  ))
  .add('example', () => (
    <HighlightCard
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
  .add('exampleWideImage', () => (
    <HighlightCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      image={[
        {
          uri: 'https://picsum.photos/1600/800/?random',
        },
      ]}
      description={
        'The way I see it, if you’re going to build a time machine into a car, why not do it with some style?'
      }
      onPressAction={() => {}}
    />
  ))
  .add('exampleSquareImage', () => (
    <HighlightCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      image={[
        {
          uri: 'https://picsum.photos/800/800/?random',
        },
      ]}
      description={
        'The way I see it, if you’re going to build a time machine into a car, why not do it with some style?'
      }
      onPressAction={() => {}}
    />
  ))
  .add('default', () => (
    <HighlightCard
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
    <HighlightCard
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
    <HighlightCard
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
    <HighlightCard
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
    <HighlightCard
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
    <HighlightCard
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
