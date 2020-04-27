import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import moment from 'moment';
import CenteredView from '../CenteredView';
import BackgroundView from '../BackgroundView';
import { H3 } from '../typography';

import ActionListCard from '.';

const actions = [
  {
    id: 'fakeId1',
    title: 'Hello 1',
    subtitle: 'Boom',
    parentChannel: {
      id: 'ContentChannel:be35f49307d7297989d3514be788ef2d',
      name: 'NewSpring - Articles',
    },
    image: {
      sources: [
        {
          uri: 'https://picsum.photos/600/400?random',
        },
      ],
    },
  },
  {
    id: 'fakeId2',
    title: 'Hello 2',
    subtitle: 'Boom',
    parentChannel: {
      id: 'ContentChannel:be35f49307d7297989d3514be788ef2d',
      name: 'NewSpring - Articles',
    },
    image: {
      sources: [
        {
          uri: 'https://picsum.photos/600/400?random',
        },
      ],
    },
  },
  {
    id: 'fakeId3',
    title: 'Hello 3',
    subtitle: 'Boom',
    parentChannel: {
      id: 'ContentChannel:be35f49307d7297989d3514be788ef2d',
      name: 'NewSpring - Articles',
    },
    image: {
      sources: [
        {
          uri: 'https://picsum.photos/600/400?random',
        },
      ],
    },
  },
  {
    id: 'fakeId4',
    title: 'Hello 4',
    subtitle: 'Boom',
    parentChannel: {
      id: 'ContentChannel:be35f49307d7297989d3514be788ef2d',
      name: 'NewSpring - Articles',
    },
    image: {
      sources: [
        {
          uri: 'https://picsum.photos/600/400?random',
        },
      ],
    },
  },
];

const eventActions = actions.map((action) => ({
  ...action,
  relatedNode: {
    start: moment('11/11/2011').toJSON(),
  },
  image: null,
}));

storiesOf('ActionListCard', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'stretch' }}>{story()}</CenteredView>
    </BackgroundView>
  ))
  .add('default', () => <ActionListCard actions={actions} />)
  .add('event actions', () => <ActionListCard actions={eventActions} />)
  .add('header', () => (
    <ActionListCard
      actions={actions}
      header={
        <H3 numberOfLines={3} ellipsizeMode="tail">
          Some random text that encourages you
        </H3>
      }
    />
  ))
  .add('onPressActionListButton', () => (
    <ActionListCard
      actions={actions}
      header={
        <H3 numberOfLines={3} ellipsizeMode="tail">
          Some random text that encourages you
        </H3>
      }
      onPressActionListButton={() => {}}
    />
  ))
  .add('isLoading', () => (
    <ActionListCard
      isLoading
      actions={actions}
      header={
        <H3 numberOfLines={3} ellipsizeMode="tail">
          Some random text that encourages you
        </H3>
      }
    />
  ));
