import React from 'react';
import renderer from 'react-test-renderer';
import { Providers } from '@apollosproject/ui-test-utils';
import { times } from 'lodash';
import CommentListFeature from './index';

const fakeData = times(10, (i) => ({
  id: `Comment:${i}`,
  person: {
    photo: { uri: `https://picsum.photos/seed/${i}/200` },
    nickName: 'Albert Flores',
    campus: {
      name: 'Anderson Campus',
    },
  },
  onPressLike: () => ({}),
  onPressActionMenu: () => ({}),
  text:
    'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
}));

describe('CommentListFeature', () => {
  it('must render', () => {
    const tree = renderer.create(
      <Providers>
        <CommentListFeature comments={fakeData} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
