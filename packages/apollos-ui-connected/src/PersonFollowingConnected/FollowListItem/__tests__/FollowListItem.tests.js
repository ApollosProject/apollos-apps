import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { Providers as UIProviders } from '@apollosproject/ui-kit';
import { Providers, renderWithApolloData } from '@apollosproject/ui-test-utils';

import FollowListItem from '..';
import { GET_PERSON_FOLLOW_STATE } from '../../hooks/useFollowPerson';

const PERSON_ID = 'Person:baf2a211-8d21-4c72-939d-1567beb4e994';

const mutualFollowMock = {
  request: {
    query: GET_PERSON_FOLLOW_STATE,
    variables: { personId: PERSON_ID },
  },
  result: {
    data: {
      node: {
        id: PERSON_ID,
        __typename: 'Person',
        followingCurrentUser: {
          __typename: 'Follow',
          id: 'Follow:99047635-b59d-4f7e-a17f-6c5ebbd3fc45',
          state: 'REQUESTED',
        },
        currentUserFollowing: {
          __typename: 'Follow',
          id: 'Follow:f98ac9f7-19af-4cbf-9e57-8da84ddfb3bc',
          state: 'ACCEPTED',
        },
      },
    },
  },
};

const requestToBeFollowedMock = {
  request: {
    query: GET_PERSON_FOLLOW_STATE,
    variables: { personId: PERSON_ID },
  },
  result: {
    data: {
      node: {
        id: PERSON_ID,
        __typename: 'Person',
        followingCurrentUser: {
          __typename: 'Follow',
          id: 'Follow:99047635-b59d-4f7e-a17f-6c5ebbd3fc45',
          state: 'REQUESTED',
        },
        currentUserFollowing: {
          __typename: 'Follow',
          id: 'Follow:f98ac9f7-19af-4cbf-9e57-8da84ddfb3bc',
          state: 'ACCEPTED',
        },
      },
    },
  },
};

const requestToFollowMock = {
  request: {
    query: GET_PERSON_FOLLOW_STATE,
    variables: { personId: PERSON_ID },
  },
  result: {
    data: {
      node: {
        id: PERSON_ID,
        __typename: 'Person',
        followingCurrentUser: {
          __typename: 'Follow',
          id: 'Follow:99047635-b59d-4f7e-a17f-6c5ebbd3fc45',
          state: 'ACCEPTED',
        },
        currentUserFollowing: {
          __typename: 'Follow',
          id: 'Follow:f98ac9f7-19af-4cbf-9e57-8da84ddfb3bc',
          state: 'REQUESTED',
        },
      },
    },
  },
};

const suggestToFollowMock = {
  request: {
    query: GET_PERSON_FOLLOW_STATE,
    variables: { personId: PERSON_ID },
  },
  result: {
    data: {
      node: {
        id: PERSON_ID,
        __typename: 'Person',
        followingCurrentUser: {
          __typename: 'Follow',
          id: 'Follow:99047635-b59d-4f7e-a17f-6c5ebbd3fc45',
          state: 'ACCEPTED',
        },
        currentUserFollowing: null,
      },
    },
  },
};

describe('PersonFollowingConnected/FollowListItem', () => {
  it('should render', async () => {
    let tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={[mutualFollowMock]}>
        <FollowListItem personId={PERSON_ID} />
      </Providers>,
      null,
      { renderCount: 3 }
    );

    expect(tree).toMatchSnapshot();
  });

  it('should render when Person A requested to follow the Current User', async () => {
    const tree = await renderWithApolloData(
      <UIProviders>
        <MockedProvider mocks={[requestToBeFollowedMock]}>
          <FollowListItem
            personId={PERSON_ID}
            availableActions={['ACCEPT_FOLLOW_REQUEST', 'SEND_FOLLOW_REQUEST']}
          />
        </MockedProvider>
      </UIProviders>
    );

    expect(tree).toMatchSnapshot();
  });

  it('should render when the Current user requested to follow Person A', async () => {
    const tree = await renderWithApolloData(
      <UIProviders>
        <MockedProvider mocks={[requestToFollowMock]}>
          <FollowListItem
            personId={PERSON_ID}
            availableActions={['ACCEPT_FOLLOW_REQUEST', 'SEND_FOLLOW_REQUEST']}
          />
        </MockedProvider>
      </UIProviders>
    );

    expect(tree).toMatchSnapshot();
  });

  it('should render when the Current User does not follow Person A', async () => {
    const tree = await renderWithApolloData(
      <UIProviders>
        <MockedProvider mocks={[suggestToFollowMock]}>
          <FollowListItem
            personId={PERSON_ID}
            availableActions={['ACCEPT_FOLLOW_REQUEST', 'SEND_FOLLOW_REQUEST']}
          />
        </MockedProvider>
      </UIProviders>
    );

    expect(tree).toMatchSnapshot();
  });
});
