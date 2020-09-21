import React from 'react';

import { storiesOf } from '@apollosproject/ui-storybook';
import { GraphQLScalarType } from 'graphql';
import { BackgroundView, CenteredView, Button } from '@apollosproject/ui-kit';
import { ApolloStorybookDecorator } from '../testUtils';
import ThemeMixinConnected from './index';

const colorScalarType = new GraphQLScalarType({
  name: 'Color',
  description: 'A rgb color string',
  serialize(value) {
    return value;
  },
  parseValue(value) {
    return value;
  },
  parseLiteral({ value }) {
    return value;
  },
});

const mocks = {
  Color: () => colorScalarType,
  Query: () => ({
    node: (root, args) => ({
      id: args.id,
      __typename: args.id.split(':')[0],
      theme: {
        type: null,
        colors: {
          primary: 'rgb(0,255,0)',
          secondary: 'rgb(0,255,0)',
          screen: 'rgb(0, 255, 0)',
          paper: 'rgb(0, 255, 0)',
        },
      },
    }),
  }),
};

storiesOf('ui-connected/ThemeMixinConnected', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'center' }}>{story()}</CenteredView>
    </BackgroundView>
  ))
  .addDecorator(ApolloStorybookDecorator({ mocks }))
  .add('example', () => (
    <ThemeMixinConnected nodeId={'UniversalContentItem:123'}>
      <Button type="primary" title="I am a bright green button!" />
    </ThemeMixinConnected>
  ));
