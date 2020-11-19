import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import { BackgroundView, CenteredView } from '@apollosproject/ui-kit';
import { ApolloStorybookDecorator } from '@apollosproject/ui-test-utils';
import FeaturesFeedConnected, { ACTION_MAP } from './FeaturesFeedConnected';

const cards = [
  {
    action: 'READ_CONTENT',
    title: 'Live for Freedom Toolkit',
    hyphenatedTitle: 'Live for Freedom Toolkit',
    hasAction: true,
    actionIcon: 'umbrella',
    labelText: 'Stormy',
    summary:
      "Celebrate your freedom in Christ — in the car, shower, cubicle or wherever you go — with this playlist of NewSpring Worship's favorite songs of the summer.",
    coverImage: {
      sources: [
        {
          uri: 'https://picsum.photos/800',
        },
      ],
    },
    __typename: 'CardListItem',
    id: 'CardListItem:7891',
  },
  {
    action: 'READ_CONTENT',
    title: 'Live for Freedom Toolkit',
    hyphenatedTitle: 'Live for Freedom Toolkit',
    hasAction: null,
    actionIcon: null,
    labelText: null,
    summary:
      "Celebrate your freedom in Christ — in the car, shower, cubicle or wherever you go — with this playlist of NewSpring Worship's favorite songs of the summer.",
    coverImage: {
      sources: [
        {
          uri: 'https://picsum.photos/800',
        },
      ],
    },
    __typename: 'CardListItem',
    id: 'CardListItem:456',
  },
  {
    action: 'READ_CONTENT',
    title: 'Live for Freedom Toolkit',
    hyphenatedTitle: 'Live for Freedom Toolkit',
    hasAction: null,
    actionIcon: null,
    labelText: null,
    summary:
      "Celebrate your freedom in Christ — in the car, shower, cubicle or wherever you go — with this playlist of NewSpring Worship's favorite songs of the summer.",
    coverImage: {
      sources: [
        {
          uri: 'https://picsum.photos/800',
        },
      ],
    },
    __typename: 'CardListItem',
    id: 'CardListItem:123',
  },
];

const mockObjects = {
  FeatureFeed: (root, args) => ({
    id: root.id || args.id,
    __typename: 'FeatureFeed',
    features: [
      {
        __typename: 'HorizontalCardListFeature',
        id: 'HorizontalCardListFeature:123',
      },
      {
        __typename: 'VerticalCardListFeature',
        id: 'VeriticalCardListFeature:123',
      },
    ],
  }),
  HorizontalCardListFeature: (root, args) => ({
    id: root.id || args.id,
    title: 'Horizontal Card List Feature',
    subtitle: "It's a great feature",
    __typename: 'HorizontalCardListFeature',
    cards,
  }),
  VerticalCardListFeature: (root, args) => ({
    id: root.id || args.id,
    title: 'Vertical Card List Feature',
    subtitle: 'Maybe better than horizontal',
    __typename: 'VerticalCardListFeature',
    cards,
  }),
};

const mocks = {
  Query: () => ({
    node: (root, args) => {
      const type = root.id ? root.id.split(':')[0] : args.id.split(':')[0];
      if (mockObjects[type]) {
        return mockObjects[type](root, args);
      }
      console.log(`no mock for ${root.id || args.id}`);
      return null;
    },
  }),
};

function onPressActionItem({ action, ...props }) {
  if (ACTION_MAP[action]) {
    ACTION_MAP[action]({ action, ...props });
  }
}

storiesOf('ui-connected/FeaturesFeedConnected', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'stretch' }}>{story()}</CenteredView>
    </BackgroundView>
  ))
  .addDecorator(ApolloStorybookDecorator({ mocks }))
  .add('example', () => (
    <FeaturesFeedConnected
      navigation={{ navigate: console.warn }}
      onPressActionItem={onPressActionItem}
      nodeId={'FeatureFeed:123'}
    />
  ));
