/* eslint-disable react-native/no-inline-styles */

import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import {
  View,
  FlatList,
  Text,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { times } from 'lodash';

import Comment from '../Comment';
import AddCommentInput from './AddCommentInput';

const fakeData = [
  { __typename: 'AddCommentInput' },
  ...times(10, (i) => ({
    __typename: 'Comment',
    profile: {
      image: { uri: `https://picsum.photos/seed/${i}/200` },
      nickName: 'Albert Flores',
    },
    subtitle: 'Anderson Campus',
    onPressLike: () => ({}),
    onPressActionMenu: () => ({}),
    commentText:
      'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
  })),
];

storiesOf('ui-kit/AddCommentInput', module)
  .add('default', () => (
    <View style={{ justifyContent: 'flex-end', flex: 1 }}>
      <AddCommentInput
        profile={{
          image: { uri: 'https://picsum.photos/200' },
        }}
      />
    </View>
  ))
  .add('with content and comments', () => (
    <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
      <ScrollView>
        {times(30, () => (
          <Text>{'----------------'}</Text>
        ))}
        <FlatList
          renderItem={({ item }) =>
            item.__typename === 'Comment' ? (
              <Comment {...item} />
            ) : (
              <AddCommentInput />
            )
          }
          data={fakeData}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  ));
