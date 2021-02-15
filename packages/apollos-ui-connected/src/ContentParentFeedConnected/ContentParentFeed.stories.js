import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { times } from 'lodash';

import { BackgroundView, CenteredView } from '@apollosproject/ui-kit';
import { ApolloStorybookDecorator } from '@apollosproject/ui-test-utils';

import ContentParentFeedConnected from './ContentParentFeedConnected';

const seriesMock = (_root, args) => ({
  id: args.id,
  __typename: 'ContentSeriesContentItem',
  childContentItemsConnection: (root, { after = 0 }) => ({
    edges: times(10, (index) => ({
      node: {
        id: `DevotionalContentItem:${index + Number(after)}`,
        __typename: 'DevotionalContentItem',
        videos: [],
        theme: null,
        summary: 'bla bla bla',
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
        parentChannel: {
          id: 'ContentChannel:559b23fd0aa90e81b1c023e72e230fa1',
          name: 'Devotional',
          iconName: 'text',
          __typename: 'ContentChannel',
        },
        title: `Devo #${index + Number(after)}`,
        hyphenatedTitle: `Devo #${index + Number(after)}`,
        sharing: {
          url:
            'https://apollosrock.newspring.cc/devotional/god-sees-who-you-can-be-not-who-you-are',
          message:
            'God sees who you can be not who you are - Life is challenging enough.',
          title: 'Share via ...',
          __typename: 'Sharable',
        },
      },
      cursor: index + Number(after),
    })),
  }),
});

const devoMock = (root, { id }) => ({
  id,
  __typename: 'DevotionalContentItem',
  videos: [],
  theme: null,
  summary: 'bla bla bla',
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
  parentChannel: {
    id: 'ContentChannel:559b23fd0aa90e81b1c023e72e230fa1',
    name: 'Devotional',
    iconName: 'text',
    __typename: 'ContentChannel',
  },
  title: `Devo #${id.split(':')[1]}`,
  hyphenatedTitle: `Devo #${id.split(':')[1]}`,
  sharing: {
    url:
      'https://apollosrock.newspring.cc/devotional/god-sees-who-you-can-be-not-who-you-are',
    message:
      'God sees who you can be not who you are - Life is challenging enough.',
    title: 'Share via ...',
    __typename: 'Sharable',
  },
});

const mocks = {
  Query: () => ({
    node: (root, args) =>
      args.id.includes('ContentSeries')
        ? seriesMock(root, args)
        : devoMock(root, args),
  }),
};

storiesOf('ui-connected/ContentParentFeed', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'stretch' }}>{story()}</CenteredView>
    </BackgroundView>
  ))
  .addDecorator(ApolloStorybookDecorator({ mocks }))
  .add('example', () => (
    <ContentParentFeedConnected
      nodeId={'ContentSeriesContentItem:123'}
      navigation={{ push: console.warn, navigate: () => ({}) }}
    />
  ));
