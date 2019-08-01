import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { ScrollView } from 'react-native';

import BackgroundView from '../BackgroundView';
import CenteredView from '../CenteredView';
import { CardLabel } from '../Card';

import HorizontalDefaultCard from '.';

storiesOf('ui-kit/HorizontalDefaultCard', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'stretch' }}>{story()}</CenteredView>
    </BackgroundView>
  ))
  .add('examples', () => (
    <ScrollView>
      <HorizontalDefaultCard
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
        labelText={'Quote'}
      />
      <HorizontalDefaultCard
        title={
          'Are you telling me that you built a time machine out of a DeLorean?'
        }
        coverImage={[
          {
            uri: 'https://picsum.photos/1400/800/?random',
          },
        ]}
        summary={
          'The way I see it, if you’re going to build a time machine into a car, why not do it with some style?'
        }
        isLiked
      />
      <HorizontalDefaultCard
        title={
          'Are you telling me that you built a time machine out of a DeLorean?'
        }
        coverImage={[
          {
            uri: 'https://picsum.photos/800/800/?random',
          },
        ]}
      />
    </ScrollView>
  ))
  .add('default', () => (
    <HorizontalDefaultCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      coverImage={[
        {
          uri: 'https://picsum.photos/1400/800/?random',
        },
      ]}
    />
  ))
  .add('summary', () => (
    <HorizontalDefaultCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      coverImage={[
        {
          uri: 'https://picsum.photos/1400/800/?random',
        },
      ]}
      summary={
        'The way I see it, if you’re going to build a time machine into a car, why not do it with some style?'
      }
    />
  ))
  .add('isLiked', () => (
    <HorizontalDefaultCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      coverImage={[
        {
          uri: 'https://picsum.photos/1400/800/?random',
        },
      ]}
      isLiked
    />
  ))
  .add('labelText', () => (
    <HorizontalDefaultCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      coverImage={[
        {
          uri: 'https://picsum.photos/1400/800/?random',
        },
      ]}
      labelText={'Quote'}
    />
  ))
  .add('isLoading', () => (
    <HorizontalDefaultCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      coverImage={[
        {
          uri: 'https://picsum.photos/1400/800/?random',
        },
      ]}
      summary={
        'The way I see it, if you’re going to build a time machine into a car, why not do it with some style?'
      }
      labelText={'Quote'}
      isLoading
    />
  ))
  .add('LabelComponent', () => (
    <HorizontalDefaultCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      coverImage={[
        {
          uri: 'https://picsum.photos/1400/800/?random',
        },
      ]}
      LabelComponent={
        <CardLabel title={'Custom LabelComponent'} type={'primary'} />
      }
    />
  ))
  .add('labelText', () => (
    <HorizontalDefaultCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      coverImage={[
        {
          uri: 'https://picsum.photos/1400/800/?random',
        },
      ]}
      labelText={'Quote'}
    />
  ));
