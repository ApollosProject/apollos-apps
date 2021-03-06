import React from 'react';

import { storiesOf } from '@apollosproject/ui-storybook';
import { BackgroundView, CenteredView } from '@apollosproject/ui-kit';

import HorizontalCardListFeature from './index';

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
    coverImage: [
      {
        uri: 'https://picsum.photos/800',
      },
    ],
    __typename: 'WeekendContentItem',
    id: 'WeekendContentItem:95ff79f60a028b1b506aaeedf8b4c6ae',
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
    coverImage: [
      {
        uri: 'https://picsum.photos/800',
      },
    ],
    __typename: 'UniversalContentItem',
    id: 'UniversalContentItem:95ff79f60a028b1b506aaeedf8b4c6ae',
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
    coverImage: [
      {
        uri: 'https://picsum.photos/800',
      },
    ],
    __typename: 'DevotionalContentItem',
    id: 'DevotionalContentItem:95ff79f60a028b1b506aaeedf8b4c6ae',
  },
];

const primaryAction = {
  title: 'See More',
  action: 'OPEN_NODE',
  relatedNode: {
    id: 'DevotionalContentItem:95ff79f60a028b1b506aaeedf8b4c6ae',
    __typename: 'DevotionalContentItem',
  },
};
storiesOf('ui-connected/HorizontalCardListFeature', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'stretch' }}>{story()}</CenteredView>
    </BackgroundView>
  ))
  .add('example', () => (
    <HorizontalCardListFeature
      cards={cards}
      title={'Title'}
      subtitle={'Subtitle'}
      primaryAction={primaryAction}
    />
  ))
  .add('default', () => <HorizontalCardListFeature cards={cards} />)
  .add('primaryAction', () => (
    <HorizontalCardListFeature cards={cards} primaryAction={primaryAction} />
  ))
  .add('isLoading', () => <HorizontalCardListFeature cards={[]} isLoading />)
  .add('subtitle', () => (
    <HorizontalCardListFeature cards={cards} subtitle={'subtitle'} />
  ))
  .add('title', () => (
    <HorizontalCardListFeature cards={cards} title={'Title'} />
  ));
