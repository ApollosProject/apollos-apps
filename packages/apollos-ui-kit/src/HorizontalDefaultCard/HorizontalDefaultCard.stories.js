import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { View, Dimensions } from 'react-native';

import BackgroundView from '../BackgroundView';
import CenteredView from '../CenteredView';
import HorizontalTileFeed from '../HorizontalTileFeed';

import HorizontalDefaultCard from '.';

storiesOf('ui-kit/HorizontalDefaultCard', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'stretch' }}>{story()}</CenteredView>
    </BackgroundView>
  ))
  .add('examples', () => {
    const HorizontalHighlightCardData = [
      {
        node: {
          coverImage: [
            {
              uri: 'https://picsum.photos/800/1600/?random',
            },
          ],
          id: 'fakeId0',
          isLiked: true,
          summary:
            'The way I see it, if you’re going to build a time machine into a car, why not do it with some style?',
          title:
            'Are you telling me that you built a time machine out of a DeLorean?',
        },
      },
      {
        node: {
          coverImage: [
            {
              uri: 'https://picsum.photos/800/1600/?random',
            },
          ],
          id: 'fakeId1',
          isLiked: false,
          title:
            'Are you telling me that you built a time machine out of a DeLorean?',
        },
      },
      {
        node: {
          coverImage: [
            {
              uri: 'https://picsum.photos/800/1600/?random',
            },
          ],
          id: 'fakeId2',
          summary:
            'The way I see it, if you’re going to build a time machine into a car, why not do it with some style?',
        },
      },
    ];

    const loadingStateObject = {
      node: {
        id: 'fakeId0',
        title: '',
        isLoading: true,
      },
    };

    const renderHorizontalHighlightCard = (
      { item } //eslint-disable-line
    ) => (
      <HorizontalDefaultCard
        coverImage={item.node.coverImage}
        isLiked={item.node.isLiked}
        isLoading={item.node.isLoading}
        title={item.node.title}
        summary={item.node.summary}
      />
    );

    return (
      <View>
        <HorizontalTileFeed
          content={HorizontalHighlightCardData}
          renderItem={renderHorizontalHighlightCard}
          loadingStateObject={loadingStateObject}
          style={{ height: Dimensions.get('window').width * 0.66 + 32 }} // kind of a random math to just make this story work
        />
      </View>
    );
  })
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
  .add('isLiked/false', () => (
    <HorizontalDefaultCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      coverImage={[
        {
          uri: 'https://picsum.photos/1400/800/?random',
        },
      ]}
      isLiked={false}
    />
  ))
  .add('isLiked/true', () => (
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
      isLoading
    />
  ))
  .add('summary', () => (
    <HorizontalDefaultCard
      coverImage={[
        {
          uri: 'https://picsum.photos/1400/800/?random',
        },
      ]}
      summary={
        'The way I see it, if you’re going to build a time machine into a car, why not do it with some style?'
      }
    />
  ));
