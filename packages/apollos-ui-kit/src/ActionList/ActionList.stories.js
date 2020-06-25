import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import moment from 'moment';

import CenteredView from '../CenteredView';
import BackgroundView from '../BackgroundView';
import { H3, H6 } from '../typography';
import styled from '../styled';

import ActionList from '.';

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
    title:
      'Hello 2 Hello 2 Hello 2 Hello 2 Hello 2 Hello 2 Hello 2 Hello 2 Hello 2 Hello 2 Hello 2 Hello 2',
    subtitle: '',
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
    title: '',
    subtitle:
      'Hello Boom Hello Boom Hello Boom Hello Boom Hello Boom Hello Boom Hello Boom Hello Boom Hello Boom Hello Boom Hello Boom ',
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
    title: 'Hello 4 Hello 4 Hello 4 Hello 4 Hello 4 Hello 4',
    subtitle:
      'Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom Boom ',
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

const eventActions = actions.map((action, i) => ({
  ...action,
  image: null,
  relatedNode: {
    start: moment(`November ${i + 1}, 2020`).toJSON(),
  },
}));

storiesOf('ActionList', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'stretch' }}>{story()}</CenteredView>
    </BackgroundView>
  ))
  .add('default', () => <ActionList actions={actions} />)
  .add('header', () => {
    const Title = styled(({ theme }) => ({
      color: theme.colors.text.tertiary,
    }))(H6);

    return (
      <ActionList
        actions={actions}
        header={
          <>
            <Title>Boom</Title>
            <H3 numberOfLines={3} ellipsizeMode="tail">
              Some random text that encourages you
            </H3>
          </>
        }
      />
    );
  })
  .add('onPressActionListButton', () => (
    <ActionList
      actions={actions}
      onPressActionListButton={() => {}}
      actionListButtonTitle="Press Me!"
    />
  ))
  .add('isCard (false)', () => <ActionList actions={actions} isCard={false} />)
  .add('with events', () => <ActionList actions={eventActions} />)
  .add('isLoading', () => (
    <ActionList
      isLoading
      actions={actions}
      header={
        <H3 numberOfLines={3} ellipsizeMode="tail">
          Some random text that encourages you
        </H3>
      }
    />
  ));
