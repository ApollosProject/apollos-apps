/* eslint-disable react-native/no-inline-styles */

import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { View, FlatList, Text, ScrollView } from 'react-native';
import { times } from 'lodash';

import Comment from '../Comment';
import { ThemeMixin } from '../theme';
import BackgroundView from '../BackgroundView';
import AddCommentInput from './AddCommentInput';

const fakeData = [
  { __typename: 'AddCommentInput' },
  ...times(10, (i) => ({
    __typename: 'Comment',
    profile: {
      photo: { uri: `https://picsum.photos/seed/${i}/200` },
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
        showInlinePrompt
        profile={{
          photo: { uri: 'https://picsum.photos/200' },
          nickName: 'Jeff Bridges',
        }}
        onSubmit={() => {}}
      />
    </View>
  ))
  .add('dark mode', () => (
    <ThemeMixin mixin={{ type: 'dark' }}>
      <BackgroundView style={{ justifyContent: 'flex-end', flex: 1 }}>
        <AddCommentInput
          showInlinePrompt
          profile={{
            photo: { uri: 'https://picsum.photos/200' },
            nickName: 'Jeff Bridges',
          }}
          onSubmit={() => {}}
        />
      </BackgroundView>
    </ThemeMixin>
  ))
  .add('with content and comments', () => (
    <ScrollView>
      {times(30, () => (
        <Text>{'----------------'}</Text>
      ))}
      <FlatList
        renderItem={({ item }) =>
          item.__typename === 'Comment' ? (
            <Comment {...item} />
          ) : (
            <AddCommentInput
              showInlinePrompt
              onSubmit={() =>
                new Promise((resolve) => setTimeout(() => resolve(), 3000))
              }
              profile={{
                photo: { uri: 'https://picsum.photos/200' },
                nickName: 'Jeff Bridges',
              }}
            />
          )
        }
        data={fakeData}
      />
    </ScrollView>
  ));
