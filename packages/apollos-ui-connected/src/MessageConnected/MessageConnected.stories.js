import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import { BackgroundView, CenteredView } from '@apollosproject/ui-kit';
import { ApolloStorybookDecorator } from '@apollosproject/ui-test-utils';
import MessageConnected from '.';

const mocks = {
  Query: () => ({
    node: () => ({
      id: 'Message:123',
      __typename: 'Message',
      htmlContent: '<h1>This is a title</h1><p>This is the body</>',
    }),
  }),
};

storiesOf('ui-connected/MessageConnected', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'stretch' }}>{story()}</CenteredView>
    </BackgroundView>
  ))
  .addDecorator(ApolloStorybookDecorator({ mocks }))
  .add('example', () => <MessageConnected nodeId={'Message:123'} />);
