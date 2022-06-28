import React from 'react';

import { MockedProvider } from '@apollo/client/testing';
import { Providers, renderWithApolloData } from '@apollosproject/ui-test-utils';
import uniqueId from 'lodash/uniqueId';

import ConfirmButton from '../ConfirmButton';
import { ACCEPT_FOLLOW_REQUEST } from '../../hooks/useAcceptFollowRequest';
import { GET_PERSON_FOLLOW_STATE } from '../../hooks/useFollowPerson';

const PERSON_ID = uniqueId('Person:');
const FOLLOWING_CURRENT_USER_ID = uniqueId('Follow:');

const acceptFollowRequestMock = {
  request: {
    query: ACCEPT_FOLLOW_REQUEST,
    variables: { personId: PERSON_ID },
  },
  result: {
    data: {
      acceptFollowRequest: {
        id: FOLLOWING_CURRENT_USER_ID,
        state: 'ACCEPT',
      },
    },
  },
};

const followPersonMock = {
  request: {
    query: GET_PERSON_FOLLOW_STATE,
    variables: { personId: PERSON_ID },
  },
  result: {
    data: {
      acceptFollowRequest: {
        id: FOLLOWING_CURRENT_USER_ID,
        state: 'REQUESTED',
      },
    },
  },
};

describe('PersonFollowingConnected/ConfirmButton', () => {
  it('should render', async () => {
    let tree = await renderWithApolloData(
      <Providers
        MockedProvider={MockedProvider}
        mocks={[acceptFollowRequestMock, followPersonMock]}
      >
        <ConfirmButton personId={PERSON_ID} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
});
