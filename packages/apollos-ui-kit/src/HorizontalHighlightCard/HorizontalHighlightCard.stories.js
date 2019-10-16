import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { View, Dimensions } from 'react-native';

import BackgroundView from '../BackgroundView';
import CenteredView from '../CenteredView';
import HorizontalTileFeed from '../HorizontalTileFeed';
import { CardLabel } from '../Card';

import HorizontalHighlightCard from '.';

storiesOf('ui-kit/HorizontalHighlightCard', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'stretch' }}>{story()}</CenteredView>
    </BackgroundView>
  ))
  .add('example', () => {
    const HorizontalHighlightCardData = [
      {
        node: {
          id: 'fakeId0',
          coverImage: [
            {
              uri: 'https://picsum.photos/800/1600/?random',
            },
          ],
          title:
            'Are you telling me that you built a time machine out of a DeLorean?',
          isLiked: true,
          label: 'Custom Label',
          hasAction: true, // may not match actual schema
          disabled: false, // may not match actual schema
        },
      },
      {
        node: {
          id: 'fakeId0',
          coverImage: [
            {
              uri: 'https://picsum.photos/800/1600/?random',
            },
          ],
          title:
            'Are you telling me that you built a time machine out of a DeLorean?',
          isLiked: false,
          label: 'Custom Label',
          hasAction: false, // may not match actual schema
          disabled: true, // may not match actual schema
        },
      },
      {
        node: {
          id: 'fakeId0',
          coverImage: [
            {
              uri: 'https://picsum.photos/800/1600/?random',
            },
          ],
          title:
            'Are you telling me that you built a time machine out of a DeLorean?',
          isLiked: true,
          label: 'Custom Label',
          hasAction: false, // may not match actual schema
          disabled: false, // may not match actual schema
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
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          height: '100%',
          aspectRatio: 1,
        }}
      >
        <HorizontalHighlightCard
          coverImage={item.node.coverImage}
          title={item.node.title}
          hasAction={item.node.hasAction}
          isLiked={item.node.isLiked}
          labelText={item.node.labelText}
          isLoading={item.node.isLoading}
          theme={item.node.theme}
          disabled={item.node.disabled}
        />
      </View>
    );

    return (
      <View>
        <HorizontalTileFeed
          content={HorizontalHighlightCardData}
          renderItem={renderHorizontalHighlightCard}
          loadingStateObject={loadingStateObject}
          style={{ height: Dimensions.get('window').width * 0.66 + 16 }} // same sizing as used within `HorizontalTileFeed`
        />
      </View>
    );
  })
  .add('default', () => (
    <HorizontalHighlightCard
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
    <HorizontalHighlightCard
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
  .add('hasAction', () => (
    <HorizontalHighlightCard
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
  .add('disabled', () => (
    <HorizontalHighlightCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      coverImage={[
        {
          uri: 'https://picsum.photos/800/1600/?random',
        },
      ]}
      disabled
    />
  ))
  .add('isLiked', () => (
    <HorizontalHighlightCard
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
  .add('isLoading', () => (
    <HorizontalHighlightCard
      title={
        'Are you telling me that you built a time machine out of a DeLorean?'
      }
      coverImage={[
        {
          uri: 'https://picsum.photos/800/1600/?random',
        },
      ]}
      hasAction
      labelText={'Custom Label'}
      isLoading
    />
  ))
  .add('LabelComponent', () => (
    <HorizontalHighlightCard
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
    <HorizontalHighlightCard
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
  .add('theme', () => {
    const HorizontalHighlightCardData = [
      {
        node: {
          id: 'fakeId0',
          coverImage: [
            {
              uri: 'https://picsum.photos/800/1600/?random',
            },
          ],
          title:
            'Are you telling me that you built a time machine out of a DeLorean?',
          hasAction: false,
          isLiked: false,
          labelText: 'Custom Tabel Text',
          theme: {
            colors: {
              primary: 'salmon',
            },
          },
        },
      },
      {
        node: {
          id: 'fakeId1',
          coverImage: [
            {
              uri: 'https://picsum.photos/800/1600/?random',
            },
          ],
          title:
            'Are you telling me that you built a time machine out of a DeLorean?',
          hasAction: true,
          isLiked: true,
          labelText: 'Custom Tabel Text',
          theme: {
            type: 'light',
            colors: {
              primary: 'yellow',
              white: 'dodgerblue',
              text: {
                primary: 'dodgerblue',
              },
            },
          },
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
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          height: '100%',
          aspectRatio: 1,
        }}
      >
        <HorizontalHighlightCard
          coverImage={item.node.coverImage}
          title={item.node.title}
          hasAction={item.node.hasAction}
          isLiked={item.node.isLiked}
          labelText={item.node.labelText}
          isLoading={item.node.isLoading}
          theme={item.node.theme}
        />
      </View>
    );

    return (
      <View>
        <HorizontalTileFeed
          content={HorizontalHighlightCardData}
          renderItem={renderHorizontalHighlightCard}
          loadingStateObject={loadingStateObject}
          style={{ height: Dimensions.get('window').width * 0.66 + 16 }} // same sizing as used within `HorizontalTileFeed`
        />
      </View>
    );
  });
