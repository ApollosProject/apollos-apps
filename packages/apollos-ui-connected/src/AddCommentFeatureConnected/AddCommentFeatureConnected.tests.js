import React from 'react';
import { Providers, renderWithApolloData } from '@apollosproject/ui-test-utils';
import { MockedProvider } from '@apollo/client/testing';

import GET_ADD_COMMENT_FEATURE from './getAddCommentFeature';

import AddCommentFeatureConnected from './AddCommentFeatureConnected';

const mock = {
  request: {
    query: GET_ADD_COMMENT_FEATURE,
    variables: { featureId: 'AddCommentFeature:123' },
  },
  result: {
    data: {
      currentUser: {
        id: 'AuthenticatedUser:123',
        __typename: 'AuthenticatedUser',
        profile: {
          __typename: 'Person',
          id: 'Person:123',
          photo: {
            uri: `https://picsum.photos/200`,
            __typename: 'ImageMediaSource',
          },
        },
      },
      node: {
        id: 'AddCommentFeature:123',
        __typename: 'AddCommentFeature',
        addPrompt: 'A great add prompt',
        initialPrompt: 'A great initial prompt',
        relatedNode: {
          id: 'UniversalContentItem:123',
          __typename: 'UniversalContentItem',
        },
      },
    },
  },
};

describe('The CommentListFeatureConnected component', () => {
  it('should render', async () => {
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={[mock]}>
        <AddCommentFeatureConnected
          refetchRef={jest.fn()}
          featureId={'AddCommentFeature:123'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
