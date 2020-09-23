import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { BackgroundView, CenteredView } from '@apollosproject/ui-kit';
import { ApolloStorybookDecorator } from '../testUtils';
import ShareButtonConnected from './ShareButtonConnected';

const mocks = {
  Query: () => ({
    node: (root, args) => ({
      id: args.id,
      __typename: 'UniversalContentItem',
      sharing: {
        title: 'This is the title',
        message: 'Here is the message',
        url: 'https://example.com',
      },
    }),
  }),
};

storiesOf('ui-connected/ShareButtonConnected', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'center' }}>{story()}</CenteredView>
    </BackgroundView>
  ))
  .addDecorator(ApolloStorybookDecorator({ mocks }))
  .add('example', () => (
    <ShareButtonConnected nodeId={'UniversalContentItem:123'} />
  ))
  .add('with itemId', () => (
    <ShareButtonConnected itemId={'UniversalContentItem:456'} />
  ));
