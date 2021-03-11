import React from 'react';
import { Providers, renderWithApolloData } from '@apollosproject/ui-test-utils';
import { MockedProvider } from '@apollo/client/testing';

import GET_SUGGESTED_FOLLOWS from './getSuggestedFollows';

import SuggestedFollowListConnected from './SuggestedFollowListConnected';

const mock = {
  request: {
    query: GET_SUGGESTED_FOLLOWS,
  },
  result: {
    data: {
      suggestedFollows: [
        {
          __typename: 'Person',
          id: 'Person:123',
          firstName: 'Joe',
          lastName: 'Tronic',
          photo: {
            __typename: 'ImageMediaSource',
            uri: 'https://example.com/photo.png',
          },
          currentUserFollowing: null,
        },
      ],
    },
  },
};

describe('The SuggestedFollowListConnected component', () => {
  it('should render', async () => {
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={[]}>
        <SuggestedFollowListConnected />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with data', async () => {
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={[mock]}>
        <SuggestedFollowListConnected
          refetchRef={jest.fn()}
          featureId={'HeroListFeature:123'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
