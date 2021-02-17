import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import moment from 'moment';

import CenteredView from '../CenteredView';
import BackgroundView from '../BackgroundView';
import { H3, H6 } from '../typography';
import styled from '../styled';

import FollowList from '.';

const followers = [
  {
    id: 'fakeId1',
    firstName: 'Joshua',
    lastName: 'Imel',
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
    firstName: 'Joe',
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
    lastName: 'Schmoe',
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

storiesOf('FollowList', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'stretch' }}>{story()}</CenteredView>
    </BackgroundView>
  ))
  .add('default', () => <FollowList followers={followers} />)
  .add('header', () => {
    const Title = styled(({ theme }) => ({
      color: theme.colors.text.tertiary,
    }))(H6);

    return (
      <FollowList
        followers={followers}
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
    <FollowList
      followers={followers}
      onPressActionListButton={() => {}}
      actionListButtonTitle="Press Me!"
    />
  ))
  .add('isCard (false)', () => (
    <FollowList followers={followers} isCard={false} />
  ))
  .add('isLoading', () => (
    <FollowList
      isLoading
      followers={followers}
      header={
        <H3 numberOfLines={3} ellipsizeMode="tail">
          Some random text that encourages you
        </H3>
      }
    />
  ));
