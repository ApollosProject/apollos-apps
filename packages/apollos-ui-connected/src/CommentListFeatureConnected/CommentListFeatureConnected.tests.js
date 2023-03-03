import React from 'react';
import { Providers, renderWithApolloData } from '@apollosproject/ui-test-utils';
import { MockedProvider } from '@apollo/client/testing';
import { times } from 'lodash';

import GET_COMMENT_LIST_FEATURE from './getCommentListFeature';

import CommentListFeatureConnected from './CommentListFeatureConnected';

const fakeData = times(10, (i) => ({
  id: `Comment:${i}`,
  __typename: 'Comment',
  isLiked: !(i % 2),
  person: {
    __typename: 'Person',
    id: `Person:${i}`,
    photo: {
      uri: `https://picsum.photos/seed/${i}/200`,
      __typename: 'ImageMediaSource',
    },
    nickName: 'Albert Flores',
    firstName: 'Albert',
    lastName: 'Flores',
    campus: {
      id: 'Campus:123',
      __typename: 'Campus',
      name: 'Anderson Campus',
    },
  },
  text:
    'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
}));

const mock = {
  request: {
    query: GET_COMMENT_LIST_FEATURE,
    variables: { featureId: 'CommentListFeature:123' },
  },
  result: {
    data: {
      node: {
        id: 'CommentListFeature:123',
        __typename: 'CommentListFeature',
        comments: fakeData,
      },
    },
  },
};

describe('The CommentListFeatureConnected component', () => {
  it('should render', async () => {
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={[mock]}>
        <CommentListFeatureConnected
          refetchRef={jest.fn()}
          featureId={'CommentListFeature:123'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
