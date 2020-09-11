import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import { BackgroundView, CenteredView } from '@apollosproject/ui-kit';
import { ApolloStorybookDecorator } from '../testUtils';
import NodeFeaturesConnected from './NodeFeaturesConnected';

const mocks = {
  Query: () => ({
    node: (root, args) => ({
      id: args.id,
      __typename: 'WeekendContentItem',
      features: [
        {
          id: 'TextFeature:123',
          __typename: 'TextFeature',
          body:
            'Quibusdam nemo quidem sed veritatis itaque. Dolorum quia numquam ea doloremque nostrum numquam non eveniet. Fuga qui voluptatibus fugiat blanditiis ut.',
        },
        {
          id: 'ScriptureFeature:123',
          __typename: 'ScriptureFeature',
          scriptures: [
            {
              id: 'Scripture:123',
              reference: 'Psalm 86:1',
              version: 'ESV',
              html: `<div class="scripture-styles">
  <p class="s">A Prayer for Help</p><p class="q1">Listen to me, <span class="nd">Lord</span>, and answer me,</p><p class="q2">for I am helpless and weak.</p>
</div>`,
            },
          ],
        },
        {
          id: 'WebviewFeature:123',
          __typename: 'WebviewFeature',
          linkText: 'Check this out',
          url: 'https://apollos.app/',
          title: 'Our Homepage',
        },
      ],
    }),
  }),
};

storiesOf('ui-connected/NodeFeaturesConnected', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'stretch' }}>{story()}</CenteredView>
    </BackgroundView>
  ))
  .addDecorator(ApolloStorybookDecorator({ mocks }))
  .add('example', () => (
    <NodeFeaturesConnected nodeId={'UniversalContentItem:123'} />
  ))
  .add('no title', () => (
    <NodeFeaturesConnected title={null} nodeId={'UniversalContentItem:123'} />
  ));
