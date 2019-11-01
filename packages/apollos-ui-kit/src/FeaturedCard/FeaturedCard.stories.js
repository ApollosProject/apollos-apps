import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { ScrollView } from 'react-native';

import BackgroundView from '../BackgroundView';
import CenteredView from '../CenteredView';
import { CardLabel } from '../Card';

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
      coverImage={[
        {
          uri: 'https://picsum.photos/800/1600/?random',
        },
      ]}
      summary={
        'The way I see it, if you’re going to build a time machine into a car, why not do it with some style?'
      }
      hasAction
      isLive
      isLiked
    />
  ))
  .add('default', () => (
    <FeaturedCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      coverImage={[
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
      coverImage={[
        {
          uri: 'https://picsum.photos/800/1600/?random',
        },
      ]}
      actionIcon={'umbrella'}
      hasAction
    />
  ))
  .add('summary', () => (
    <FeaturedCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      coverImage={[
        {
          uri: 'https://picsum.photos/800/1600/?random',
        },
      ]}
      summary={
        'The way I see it, if you’re going to build a time machine into a car, why not do it with some style?'
      }
    />
  ))
  .add('hasAction', () => (
    <FeaturedCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      coverImage={[
        {
          uri: 'https://picsum.photos/800/1600/?random',
        },
      ]}
      hasAction
    />
  ))
  .add('isLiked/false', () => (
    <FeaturedCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      coverImage={[
        {
          uri: 'https://picsum.photos/800/1600/?random',
        },
      ]}
      isLiked={false}
    />
  ))
  .add('isLiked/true', () => (
    <FeaturedCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      coverImage={[
        {
          uri: 'https://picsum.photos/800/1600/?random',
        },
      ]}
      isLiked
    />
  ))
  .add('isLive', () => (
    <FeaturedCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      coverImage={[
        {
          uri: 'https://picsum.photos/800/1600/?random',
        },
      ]}
      isLive
    />
  ))
  .add('isLoading', () => (
    <FeaturedCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      coverImage={[
        {
          uri: 'https://picsum.photos/800/1600/?random',
        },
      ]}
      summary={
        'The way I see it, if you’re going to build a time machine into a car, why not do it with some style?'
      }
      hasAction
      isLive
      isLoading
    />
  ))
  .add('LabelComponent', () => (
    <FeaturedCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      coverImage={[
        {
          uri: 'https://picsum.photos/800/1600/?random',
        },
      ]}
      LabelComponent={<CardLabel title={'Custom LabelComponent'} />}
    />
  ))
  .add('labelText', () => (
    <FeaturedCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      coverImage={[
        {
          uri: 'https://picsum.photos/800/1600/?random',
        },
      ]}
      labelText={'Quote'}
    />
  ))
  .add('theme', () => (
    <ScrollView>
      <FeaturedCard
        title={
          'Are you telling me that you built a time machine out of a DeLorean?'
        }
        coverImage={[
          {
            uri: 'https://picsum.photos/800/1600/?random',
          },
        ]}
        hasAction
        theme={{
          colors: {
            primary: 'salmon',
            secondary: 'salmon',
          },
        }}
      />
      <FeaturedCard
        title={
          'Are you telling me that you built a time machine out of a DeLorean?'
        }
        coverImage={[
          {
            uri: 'https://picsum.photos/800/1600/?random',
          },
        ]}
        theme={{
          type: 'light',
        }}
      />
      <FeaturedCard
        title={
          'Are you telling me that you built a time machine out of a DeLorean?'
        }
        coverImage={[
          {
            uri: 'https://picsum.photos/800/1600/?random',
          },
        ]}
        summary={
          'The way I see it, if you’re going to build a time machine into a car, why not do it with some style?'
        }
        isLive
        isLiked
        hasAction
        theme={{
          type: 'light',
          colors: {
            primary: 'yellow',
            secondary: 'dodgerblue',
            text: {
              primary: 'dodgerblue',
            },
          },
        }}
      />
    </ScrollView>
  ));
