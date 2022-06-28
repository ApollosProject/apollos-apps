import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { Providers, renderWithApolloData } from '@apollosproject/ui-test-utils';

import PersonIdFollowedByList from '..';
import { GET_PERSON_IS_FOLLOWED_BY } from '../../hooks/usePersonFollowedBy';
import { GET_CURRENT_USER_FOLLOW_REQUESTS } from '../../hooks/useCurrentUserFollowRequests';

const PERSON_ID = 'Person:baf2a211-8d21-4c72-939d-1567beb4e994';

const followRequestsEmptyMock = {
  request: {
    query: GET_CURRENT_USER_FOLLOW_REQUESTS,
  },
  result: {
    data: {
      followRequests: [],
    },
  },
};

const followRequestsMock = {
  request: {
    query: GET_CURRENT_USER_FOLLOW_REQUESTS,
  },
  result: {
    data: {
      followRequests: [
        {
          __typename: 'Person',
          id: 'Person:1',
          firstName: 'First',
          lastName: 'Last',
          photo: {
            __typename: 'ImageMediaSource',
            uri: 'https://my.photo.com',
          },
          followingCurrentUser: {
            __typename: 'Follow',
            id: 'Follow:1',
            state: 'REQUESTED',
          },
          currentUserFollowing: null,
        },
      ],
    },
  },
};

const followedByMock = {
  request: {
    query: GET_PERSON_IS_FOLLOWED_BY,
    variables: {
      personId: PERSON_ID,
      query: {
        first: 20,
        after: null,
      },
    },
  },
  result: {
    data: {
      node: {
        __typename: 'Person',
        id: PERSON_ID,
        followedBy: {
          __typename: 'SearchPeopleResultsConnection',
          edges: [
            {
              // both users follow each other
              __typename: 'SearchPeopleResult',
              cursor: 'first',
              node: {
                __typename: 'Person',
                id: 'Person:1',
                firstName: 'First',
                lastName: 'Last',
                photo: {
                  __typename: 'ImageMediaSource',
                  uri: 'https://my.photo.com',
                },
                currentUserFollowing: {
                  __typename: 'Follow',
                  id: 'Follow:1',
                  state: 'ACCEPTED',
                },
                followingCurrentUser: {
                  __typename: 'Follow',
                  id: 'Follow:2',
                  state: 'ACCEPTED',
                },
              },
            },
            {
              // the current user does not follow this person
              __typename: 'SearchPeopleResult',
              cursor: 'second',
              node: {
                __typename: 'Person',
                id: 'Person:2',
                firstName: 'First',
                lastName: 'Last',
                photo: {
                  __typename: 'ImageMediaSource',
                  uri: 'https://my.photo.com',
                },
                currentUserFollowing: null,
                followingCurrentUser: {
                  __typename: 'Follow',
                  id: 'Follow:4',
                  state: 'ACCEPTED',
                },
              },
            },
            {
              // the current user has requested to follow this person
              __typename: 'SearchPeopleResult',
              cursor: 'third',
              node: {
                __typename: 'Person',
                id: 'Person:3',
                firstName: 'First',
                lastName: 'Last',
                photo: {
                  __typename: 'ImageMediaSource',
                  uri: 'https://my.photo.com',
                },
                currentUserFollowing: {
                  __typename: 'Follow',
                  id: 'Follow:5',
                  state: 'REQUESTED',
                },
                followingCurrentUser: {
                  __typename: 'Follow',
                  id: 'Follow:6',
                  state: 'ACCEPTED',
                },
              },
            },
          ],
          pageInfo: {
            __typename: 'PaginationInfo',
            startCursor: 'first',
            endCursor: 'third',
          },
          totalCount: 20,
        },
      },
    },
  },
};

describe('PersonFollowingConnected/PersonIsFollowedByList', () => {
  it('renders a list of followers with no pending follow requests', async () => {
    let tree = await renderWithApolloData(
      <Providers
        MockedProvider={MockedProvider}
        mocks={[followedByMock, followRequestsEmptyMock]}
      >
        <PersonIdFollowedByList personId={PERSON_ID} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });

  it('renders a list of followers with pending follow requests', async () => {
    let tree = await renderWithApolloData(
      <Providers
        MockedProvider={MockedProvider}
        mocks={[followedByMock, followRequestsMock]}
      >
        <PersonIdFollowedByList personId={PERSON_ID} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
});
