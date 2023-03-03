import React from 'react';
import { Alert, FlatList } from 'react-native';
import { storiesOf } from '@apollosproject/ui-storybook';

import { times } from 'lodash';
import CenteredView from '../CenteredView';
import Comment from './Comment';

const fakeData = times(10, (i) => ({
  profile: {
    photo: { uri: `https://picsum.photos/seed/${i}/200` },
    nickName: 'Albert Flores',
  },
  subtitle: 'Anderson Campus',
  onPressLike: () => ({}),
  onPressActionMenu: () => ({}),
  commentText:
    'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
}));

storiesOf('ui-kit/Comment', module)
  .addDecorator((story) => <CenteredView>{story()}</CenteredView>)
  .add('Example', () => (
    <Comment
      profile={{
        photo: { uri: 'https://picsum.photos/200' },
        nickName: 'Albert Flores',
      }}
      subtitle={'Anderson Campus'}
      commentText={
        'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.'
      }
      onPressLike={() => Alert.alert('You pressed like!')}
      onPressActionMenu={() => Alert.alert('You pressed action menu!')}
    />
  ))
  .add('isLiked', () => (
    <Comment
      profile={{
        photo: { uri: 'https://picsum.photos/200' },
        nickName: 'Albert Flores',
      }}
      subtitle={'Anderson Campus'}
      commentText={
        'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.'
      }
      onPressLike={() => Alert.alert('You pressed like!')}
      onPressActionMenu={() => Alert.alert('You pressed action menu!')}
      isLiked
    />
  ))
  .add('without onPressLike', () => (
    <Comment
      profile={{
        photo: { uri: 'https://picsum.photos/200' },
        nickName: 'Albert Flores',
      }}
      subtitle={'Anderson Campus'}
      commentText={
        'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.'
      }
      onPressActionMenu={() => Alert.alert('You pressed action menu!')}
    />
  ))
  .add('without onPressActionMenu', () => (
    <Comment
      profile={{
        photo: { uri: 'https://picsum.photos/200' },
        nickName: 'Albert Flores',
      }}
      subtitle={'Anderson Campus'}
      commentText={
        'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.'
      }
      onPressLike={() => Alert.alert('You pressed like!')}
    />
  ))
  .add('as a flatlist render', () => (
    <FlatList
      renderItem={({ item }) => <Comment {...item} />}
      data={fakeData}
    />
  ));
