import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import { BackgroundView, CenteredView } from '@apollosproject/ui-kit';
import apolloStorybookDecorator from 'apollo-storybook-react-native';
import typeDefs from '../typeDefsMock';
import NodeFeaturesConnected from './NodeFeaturesConnected';

const mocks = {
  Query: () => ({
    node: (root, args) => ({
      id: args.id,
      __typename: 'UniversalContentItem',
      __type: 'UniversalContentItem',
      __resolveType: () => console.warn('checking') || 'UniversalContentItem',
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
  .addDecorator(
    apolloStorybookDecorator({
      typeDefs,
      mocks,
      typeResolvers: {
        Node: {
          // resolveType: (args) => console.warn(args) || 'UniversalContentItem',
          __resolveType: (args) => console.warn(args) || 'UniversalContentItem',
        },
        FeaturesNode: {
          __resolveType: (args) => console.warn(args) || 'UniversalContentItem',
        },
      },
    })
  )
  .add('example', () => (
    <NodeFeaturesConnected nodeId={'UniversalContentItem:123'} />
  ));
