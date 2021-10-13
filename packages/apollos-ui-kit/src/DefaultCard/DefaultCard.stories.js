import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { ScrollView } from 'react-native';

import BackgroundView from '../BackgroundView';
import CenteredView from '../CenteredView';
import { CardLabel } from '../Card';
import { ThemeMixin } from '../theme';
import DefaultCard from './index';

storiesOf('ui-kit/DefaultCard', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'stretch' }}>{story()}</CenteredView>
    </BackgroundView>
  ))
  .add('examples', () => (
    <ScrollView>
      <DefaultCard
        title={
          'Are you telling me that you built a time machine out of a DeLorean?'
        }
        coverImage={[
          {
            uri: 'https://picsum.photos/id/857/800/1600',
          },
        ]}
        summary={
          'The way I see it, if you’re going to build a time machine into a car, why not do it with some style?'
        }
        labelText={'Quote'}
      />
      <DefaultCard
        title={
          'Are you telling me that you built a time machine out of a DeLorean?'
        }
        coverImage={[
          {
            uri: 'https://picsum.photos/id/324/1400/800',
          },
        ]}
        isLiked
        summary={
          'The way I see it, if you’re going to build a time machine into a car, why not do it with some style?'
        }
      />
      <DefaultCard
        title={
          'Are you telling me that you built a time machine out of a DeLorean?'
        }
        coverImage={[
          {
            uri: 'https://picsum.photos/id/100/800/800',
          },
        ]}
        isLiked={false}
      />
    </ScrollView>
  ))
  .add('dark examples', () => (
    <ThemeMixin mixin={{ type: 'dark' }}>
      <ScrollView>
        <DefaultCard
          title={
            'Are you telling me that you built a time machine out of a DeLorean?'
          }
          coverImage={[
            {
              uri: 'https://picsum.photos/id/857/800/1600',
            },
          ]}
          summary={
            'The way I see it, if you’re going to build a time machine into a car, why not do it with some style?'
          }
          labelText={'Quote'}
        />
        <DefaultCard
          title={
            'Are you telling me that you built a time machine out of a DeLorean?'
          }
          coverImage={[
            {
              uri: 'https://picsum.photos/id/324/1400/800',
            },
          ]}
          isLiked
          summary={
            'The way I see it, if you’re going to build a time machine into a car, why not do it with some style?'
          }
        />
        <DefaultCard
          title={
            'Are you telling me that you built a time machine out of a DeLorean?'
          }
          coverImage={[
            {
              uri: 'https://picsum.photos/id/100/800/800',
            },
          ]}
          isLiked={false}
        />
      </ScrollView>
    </ThemeMixin>
  ))
  .add('default', () => (
    <DefaultCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      coverImage={[
        {
          uri: 'https://picsum.photos/1400/800',
        },
      ]}
    />
  ))
  .add('summary', () => (
    <DefaultCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      coverImage={[
        {
          uri: 'https://picsum.photos/1400/800',
        },
      ]}
      summary={
        'The way I see it, if you’re going to build a time machine into a car, why not do it with some style?'
      }
    />
  ))
  .add('isLiked/false', () => (
    <DefaultCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      coverImage={[
        {
          uri: 'https://picsum.photos/1400/800',
        },
      ]}
      isLiked={false}
    />
  ))
  .add('isLiked/true', () => (
    <DefaultCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      coverImage={[
        {
          uri: 'https://picsum.photos/1400/800',
        },
      ]}
      isLiked
    />
  ))
  .add('labelText', () => (
    <DefaultCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      coverImage={[
        {
          uri: 'https://picsum.photos/1400/800',
        },
      ]}
      labelText={'Quote'}
    />
  ))
  .add('actionIcon', () => (
    <DefaultCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      coverImage={[
        {
          uri: 'https://picsum.photos/1400/800',
        },
      ]}
      actionIcon={'umbrella'}
    />
  ))
  .add('actionIcon and label', () => (
    <DefaultCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      coverImage={[
        {
          uri: 'https://picsum.photos/1400/800',
        },
      ]}
      actionIcon={'umbrella'}
      labelText={'Quote'}
    />
  ))
  .add('isLoading', () => <DefaultCard isLoading />)
  .add('LabelComponent', () => (
    <DefaultCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      coverImage={[
        {
          uri: 'https://picsum.photos/1400/800',
        },
      ]}
      LabelComponent={
        <CardLabel title={'Custom LabelComponent'} type={'primary'} />
      }
    />
  ))
  .add('labelText', () => (
    <DefaultCard
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
  .add('isLive', () => (
    <DefaultCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      coverImage={[
        {
          uri: 'https://picsum.photos/1400/800',
        },
      ]}
      isLive
    />
  ));
