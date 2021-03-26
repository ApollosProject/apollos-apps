import React from 'react';
import { Alert } from 'react-native';

import renderer from 'react-test-renderer';
import Providers from '../Providers';
import Comment from './Comment';

describe('ui-kit/Comment', () => {
  it('Should render', () => {
    const tree = renderer.create(
      <Providers>
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
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('Should render without onPressLike', () => {
    const tree = renderer.create(
      <Providers>
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
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('Should render with isLiked', () => {
    const tree = renderer.create(
      <Providers>
        <Comment
          profile={{
            photo: { uri: 'https://picsum.photos/200' },
            nickName: 'Albert Flores',
          }}
          subtitle={'Anderson Campus'}
          commentText={
            'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.'
          }
          isLiked
          onPressActionMenu={() => Alert.alert('You pressed action menu!')}
          onPressLike={() => Alert.alert('You pressed like!')}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render without onPressActionMenu', () => {
    const tree = renderer.create(
      <Providers>
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
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
