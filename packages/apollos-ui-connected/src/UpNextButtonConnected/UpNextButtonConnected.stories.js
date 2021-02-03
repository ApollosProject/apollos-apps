import React from 'react';

import { storiesOf } from '@apollosproject/ui-storybook';

import { BackgroundView, CenteredView } from '@apollosproject/ui-kit';
import { ApolloStorybookDecorator } from '@apollosproject/ui-test-utils';
import UpNextButtonConnected from './index';

const mocks = {
  Query: () => ({
    node: (root, args) =>
      args.id === 'ContentSeriesContentItem:123'
        ? {
            id: args.id,
            __typename: args.id.split(':')[0],
            upNext: {
              __typename: 'UniversalContentItem',
              id: 'UniversalContentItem:123',
            },
          }
        : {
            id: args.id,
            __typename: args.id.split(':')[0],
            upNext: null,
            childContentItemsConnection: {
              __typename: 'ContentItemsConnection',
              edges: [
                {
                  node: {
                    id: 'UniversalContentItem:2',
                    __typename: 'UniversalContentItem',
                  },
                  __typename: 'ContentItemsConnectionEdge',
                },
              ],
            },
          },
  }),
};

storiesOf('ui-connected/UpNextButtonConnected', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'stretch' }}>{story()}</CenteredView>
    </BackgroundView>
  ))
  .addDecorator(ApolloStorybookDecorator({ mocks }))
  .add('example', () => (
    <UpNextButtonConnected
      navigation={{ push: console.warn }}
      contentId={'ContentSeriesContentItem:123'}
    />
  ))
  .add('finshed', () => (
    <UpNextButtonConnected
      navigation={{ push: console.warn }}
      contentId={'ContentSeriesContentItem:456'}
    />
  ));
