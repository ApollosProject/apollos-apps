import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { BackgroundView, CenteredView } from '@apollosproject/ui-kit';
import { ApolloStorybookDecorator } from '../testUtils';
import LikeButtonConnected from './LikeButtonConnected';

const isLiked = false;

const mocks = {
  Query: () => ({
    node: (root, args) => ({
      id: args.id,
      __typename: 'UniversalContentItem',
      isLiked,
    }),
    isLoggedIn: () => true,
  }),
  Mutation: () => ({
    updateLikeNode: (root, { input: { nodeId, operation } }) => ({
      isLiked: operation === 'Like',
      id: nodeId,
      likedCount: 10,
      __typename: nodeId.split(':')[0],
    }),
  }),
};

storiesOf('ui-connected/LikeButtonConnected', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'center' }}>{story()}</CenteredView>
    </BackgroundView>
  ))
  .addDecorator(ApolloStorybookDecorator({ mocks }))
  .add('example', () => (
    <LikeButtonConnected
      navigation={{ push: console.warn }}
      nodeId={'UniversalContentItem:123'}
    />
  ))
  .add('with itemId', () => (
    <LikeButtonConnected
      navigation={{ push: console.warn }}
      itemId={'UniversalContentItem:456'}
    />
  ));
