import React from 'react';
import { Providers, renderWithApolloData } from '@apollosproject/ui-test-utils';
import { MockedProvider } from '@apollo/client/testing';

import GET_REQUESTED_FOLLOWS from './getRequestedFollows';

import RequestedFollowListConnected from './RequestedFollowListConnected';

const mock = {
  request: {
    query: GET_REQUESTED_FOLLOWS,
  },
  result: {
    data: {
      followRequests: [
        {
          __typename: 'Person',
          id: 'Person:123',
          firstName: 'Joe',
          lastName: 'Tronic',
          photo: {
            __typename: 'ImageMediaSource',
            uri: 'https://example.com/photo.png',
          },
          followingCurrentUser: {
            __typename: 'Follow',
            id: 'Follow:123',
            state: 'REQUESTED',
          },
          currentUserFollowing: null,
        },
      ],
    },
  },
};

describe('The RequestedFollowListConnected component', () => {
  it('should render', async () => {
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={[]}>
        <RequestedFollowListConnected />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with data', async () => {
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={[mock]}>
        <RequestedFollowListConnected
          refetchRef={jest.fn()}
          featureId={'HeroListFeature:123'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
