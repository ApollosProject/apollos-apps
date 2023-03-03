import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import FeaturedCard from './index';

storiesOf('ui-kit/FeaturedCard', module)
  .add('example', () => (
    <FeaturedCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      coverImage={[
        {
          uri: 'https://picsum.photos/id/1041/800/1600',
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
          uri: 'https://picsum.photos/id/1040/800/1600',
        },
      ]}
    />
  ))

  .add('summary', () => (
    <FeaturedCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      coverImage={[
        {
          uri: 'https://picsum.photos/id/1039/800/1600',
        },
      ]}
      summary={
        'The way I see it, if you’re going to build a time machine into a car, why not do it with some style?'
      }
    />
  ))

  .add('isLiked/false', () => (
    <FeaturedCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      coverImage={[
        {
          uri: 'https://picsum.photos/id/1042/800/1600',
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
          uri: 'https://picsum.photos/id/1028/800/1600',
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
          uri: 'https://picsum.photos/id/1027/800/1600',
        },
      ]}
      isLive
    />
  ))
  .add('isLoading', () => <FeaturedCard isLoading />)
  .add('labelText', () => (
    <FeaturedCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      coverImage={[
        {
          uri: 'https://picsum.photos/id/1026/800/1600',
        },
      ]}
      labelText={'Quote'}
    />
  ));
