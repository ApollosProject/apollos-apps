import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { get } from 'lodash';

import {
  BackgroundView,
  CenteredView,
  HorizontalDefaultCard,
  HorizontalHighlightCard,
  ThemeMixin,
} from '@apollosproject/ui-kit';
import gql from 'graphql-tag';
import { ApolloStorybookDecorator } from '@apollosproject/ui-test-utils';

import HorizontalContentCardConnected from './HorizontalContentCardConnected';

// eslint-disable-next-line
const cardMapper = ({ title, hyphenatedTitle, ...props }) => {
  // map typename to the the card we want to render.
  switch (get(props, '__typename')) {
    case 'MediaContentItem':
    case 'WeekendContentItem':
    case 'ContentSeriesContentItem':
    case 'DevotionalContentItem':
    case 'Event':
      return <HorizontalHighlightCard title={hyphenatedTitle} {...props} />;
    default:
      return <HorizontalDefaultCard title={title} {...props} />;
  }
};

const overrides = {
  'ui-connected.HorizontalContentCardConnected.HorizontalContentCardComponentMapper': {
    Component: () => cardMapper,
  },
};

const additionalSchema = [
  gql`
    extend type Event {
      title(hyphenated: Boolean): String
      coverImage: ImageMedia
      summary: String
    }

    extend type Event implements Card
  `,
];

const possibleTypes = {
  Card: ['Event'],
};

const mocks = {
  Query: () => ({
    node: (root, args) => ({
      id: args.id,
      __typename: 'Event',
      title: 'Some Recent Event',
      coverImage: {
        name: 'Square image',
        __typename: 'ImageMedia',
        sources: [
          {
            uri:
              'https://res.cloudinary.com/apollos/image/fetch/c_limit,f_auto,w_1600/https://apollosrock.newspring.cc/GetImage.ashx%3Fguid%3D31af1a61-360c-4b1e-8e62-45517c06a9a2',
            __typename: 'ImageMediaSource',
          },
        ],
      },
      summary: "It's pretty fun, you should come",
    }),
  }),
};

storiesOf('ui-connected/HorizontalContentCardConnected', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'stretch' }}>{story()}</CenteredView>
    </BackgroundView>
  ))
  .addDecorator(
    ApolloStorybookDecorator({ mocks, additionalSchema, possibleTypes })
  )
  .add('example event', () => (
    <HorizontalContentCardConnected
      contentId={'Event:123'}
      navigation={{ push: console.warn, navigate: () => ({}) }}
    />
  ))
  .add('example event with overrides', () => (
    <ThemeMixin mixin={{ overrides }}>
      <HorizontalContentCardConnected
        contentId={'Event:123'}
        navigation={{ push: console.warn, navigate: () => ({}) }}
      />
    </ThemeMixin>
  ));
