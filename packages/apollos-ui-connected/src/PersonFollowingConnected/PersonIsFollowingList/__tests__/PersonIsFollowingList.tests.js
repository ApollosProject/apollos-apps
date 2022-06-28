import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { Providers, renderWithApolloData } from '@apollosproject/ui-test-utils';

import PersonIsFollowingList from '..';
import { GET_PERSON_IS_FOLLOWING } from '../../hooks/usePersonFollowing';

const PERSON_ID = 'Person:baf2a211-8d21-4c72-939d-1567beb4e994';

const followingMock = {
  request: {
    query: GET_PERSON_IS_FOLLOWING,
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
        following: {
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
              // the person does not follow the current user
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
                currentUserFollowing: {
                  __typename: 'Follow',
                  id: 'Follow:3',
                  state: 'ACCEPTED',
                },
                followingCurrentUser: null,
              },
            },
            {
              // the person has requested to follow the current user
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
                  state: 'ACCEPTED',
                },
                followingCurrentUser: {
                  __typename: 'Follow',
                  id: 'Follow:6',
                  state: 'REQUESTED',
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

describe('PersonFollowingConnected/PersonIsFollowingList', () => {
  it('renders a list of people that a user follows', async () => {
    let tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={[followingMock]}>
        <PersonIsFollowingList personId={PERSON_ID} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
});
