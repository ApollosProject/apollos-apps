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
      <Avatar isLoading size={'small'} placeholderInitials={'VW'} />
      <Avatar isLoading size={'medium'} placeholderInitials={'VW'} />
      <Avatar isLoading size={'large'} placeholderInitials={'VW'} />
      <Avatar isLoading size={'small'} placeholderInitials={'CV'} />
      <Avatar isLoading size={'medium'} placeholderInitials={'CV'} />
      <Avatar isLoading size={'large'} placeholderInitials={'CV'} />
      <Avatar isLoading size={'small'} placeholderInitials={'MN'} />
      <Avatar isLoading size={'medium'} placeholderInitials={'MN'} />
      <Avatar isLoading size={'large'} placeholderInitials={'MN'} />
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
