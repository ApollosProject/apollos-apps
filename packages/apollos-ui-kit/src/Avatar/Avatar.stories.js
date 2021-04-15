import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import CenteredView from '../CenteredView';

import Avatar from '.';

/* eslint-disable react-native/no-inline-styles */
storiesOf('ui-kit/Avatar', module)
  .addDecorator((story) => <CenteredView>{story()}</CenteredView>)
  .add('default', () => (
    <>
      <Avatar size={'small'} />
      <Avatar size={'medium'} />
      <Avatar size={'large'} />
    </>
  ))
  .add('buttonIcon', () => (
    <>
      <Avatar
        source={{ uri: 'https://picsum.photos/200' }}
        size={'small'}
        buttonIcon={'settings'}
        onPressIcon={() => {}}
      />
      <Avatar
        source={{ uri: 'https://picsum.photos/200' }}
        size={'medium'}
        buttonIcon={'settings'}
        onPressIcon={() => {}}
      />
      <Avatar
        source={{ uri: 'https://picsum.photos/200' }}
        size={'large'}
        buttonIcon={'settings'}
        onPressIcon={() => {}}
      />
    </>
  ))
  .add('buttonIcon && isLoading', () => (
    <>
      <Avatar
        isLoading
        source={{ uri: 'https://picsum.photos/200' }}
        size={'small'}
        buttonIcon={'settings'}
        onPressIcon={() => {}}
      />
      <Avatar
        isLoading
        source={{ uri: 'https://picsum.photos/200' }}
        size={'medium'}
        buttonIcon={'settings'}
        onPressIcon={() => {}}
      />
      <Avatar
        isLoading
        source={{ uri: 'https://picsum.photos/200' }}
        size={'large'}
        buttonIcon={'settings'}
        onPressIcon={() => {}}
      />
    </>
  ))
  .add('placeholder initals', () => (
    <>
      <Avatar
        isLoading
        size={'small'}
        profile={{ firstName: 'Vincent', lastName: 'Wilson' }}
      />
      <Avatar
        isLoading
        size={'medium'}
        profile={{ firstName: 'Vincent', lastName: 'Wilson' }}
      />
      <Avatar
        isLoading
        size={'large'}
        profile={{ firstName: 'Vincent', lastName: 'Wilson' }}
      />
      <Avatar
        isLoading
        size={'small'}
        profile={{ firstName: 'Conrad', lastName: 'VanLandingham' }}
      />
      <Avatar
        isLoading
        size={'medium'}
        profile={{ firstName: 'Conrad', lastName: 'VanLandingham' }}
      />
      <Avatar
        isLoading
        size={'large'}
        profile={{ firstName: 'Conrad', lastName: 'VanLandingham' }}
      />
      <Avatar
        isLoading
        size={'small'}
        profile={{ firstName: 'michael', lastName: 'neeley' }}
      />
      <Avatar
        isLoading
        size={'medium'}
        profile={{ firstName: 'michael', lastName: 'neeley' }}
      />
      <Avatar
        isLoading
        size={'large'}
        profile={{ firstName: 'michael', lastName: 'neeley' }}
      />
    </>
  ))
  .add('notification', () => (
    <>
      <Avatar
        source={{ uri: 'https://picsum.photos/200' }}
        size={'small'}
        notification
      />
      <Avatar
        source={{ uri: 'https://picsum.photos/200' }}
        size={'medium'}
        notification
      />
      <Avatar
        source={{ uri: 'https://picsum.photos/200' }}
        size={'large'}
        notification
      />
    </>
  ));
