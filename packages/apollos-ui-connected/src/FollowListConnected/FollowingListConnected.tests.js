import React from 'react';
import { Providers, renderWithApolloData } from '@apollosproject/ui-test-utils';
import { MockedProvider } from '@apollo/client/testing';

import GET_USERS_FOLLOWING from './getFollowing';

import FollowingListConnected from './FollowingListConnected';

const mock = {
  request: {
    query: GET_USERS_FOLLOWING,
  },
  result: {
    data: {
      usersFollowing: [
        {
          __typename: 'Person',
          id: 'Person:123',
          firstName: 'Joe',
          lastName: 'Tronic',
          photo: {
            __typename: 'ImageMediaSource',
            uri: 'https://example.com/photo.png',
          },
          followingCurrentUser: null,
          currentUserFollowing: {
            __typename: 'Follow',
            id: '02103',
            state: 'REQUESTED',
          },
        },
      ],
    },
  },
};

describe('The FollowingListConnected component', () => {
  it('should render', async () => {
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={[]}>
        <FollowingListConnected />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with data', async () => {
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={[mock]}>
        <FollowingListConnected
          refetchRef={jest.fn()}
          featureId={'HeroListFeature:123'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
