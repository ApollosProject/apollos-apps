import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import { BackgroundView, CenteredView } from '@apollosproject/ui-kit';
import gql from 'graphql-tag';
import { ApolloStorybookDecorator } from '@apollosproject/ui-test-utils';

import ContentCardConnected from './ContentCardConnected';

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

storiesOf('ui-connected/ContentCardConnected', module)
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
    <ContentCardConnected
      contentId={'Event:123'}
      navigation={{ push: console.warn, navigate: () => ({}) }}
    />
  ));
