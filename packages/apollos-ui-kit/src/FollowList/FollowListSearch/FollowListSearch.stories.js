import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { createStackNavigator } from '@react-navigation/stack';

import CenteredView from '../../CenteredView';
import BackgroundView from '../../BackgroundView';
import { H3, H4 } from '../../typography';

import FollowList from '..';
import FollowListSearchModal from './FollowListSearchModal';
import FollowListSearch from '.';

const followerRequests = [
  {
    id: 'fakeId1',
    request: true,
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
    request: true,
    firstName: 'Joe',
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
];

const followerSuggestions = [
  {
    id: 'fakeId3',
    firstName: 'John',
    lastName: 'Doe',
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
    firstName: 'Billy',
    lastName: 'Bob',
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

const buttonFuncs = {
  onHide(id) {
    console.log(`hide request for ${id}`);
  },
  onConfirm(id) {
    console.log(`confirm request for ${id}`);
  },
  onFollow(id) {
    console.log(`follow request for ${id}`);
  },
};

storiesOf('FollowListSearch', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'stretch' }}>{story()}</CenteredView>
    </BackgroundView>
  ))
  .add('default', () => {
    const RootStack = createStackNavigator();
    return (
      <RootStack.Navigator mode="modal">
        <RootStack.Screen name="Main" options={{ headerShown: false }}>
          {({ navigation, ...props }) => (
            <FollowList
              followers={[]}
              onPressFollowListButton={() => navigation.navigate('FollowModal')}
              followListButtonTitle="Search"
              {...props}
            />
          )}
        </RootStack.Screen>
        <RootStack.Screen
          name="FollowModal"
          component={FollowListSearchModal}
        />
      </RootStack.Navigator>
    );
  })
  .add('header', () => {
    return (
      <FollowList
        followers={followerRequests}
        header={
          <H4 numberOfLines={1} ellipsizeMode="tail">
            Follow Requests
          </H4>
        }
        {...buttonFuncs}
      />
    );
  })
  .add('onPressActionListButton', () => (
    <FollowList
      followers={followerRequests}
      onPressFollowListButton={() => {}}
      followListButtonTitle="Find People to Follow"
      {...buttonFuncs}
    />
  ))
  .add('isLoading', () => (
    <FollowList
      isLoading
      followers={followerRequests}
      header={
        <H3 numberOfLines={1} ellipsizeMode="tail">
          Some random text that encourages you
        </H3>
      }
      {...buttonFuncs}
    />
  ));
