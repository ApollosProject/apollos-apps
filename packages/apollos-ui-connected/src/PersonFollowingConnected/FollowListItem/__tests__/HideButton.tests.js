import React from 'react';

import { MockedProvider } from '@apollo/client/testing';
import { Providers, renderWithApolloData } from '@apollosproject/ui-test-utils';
import uniqueId from 'lodash/uniqueId';

import HideButton from '../HideButton';
import { IGNORE_FOLLOW_REQUEST } from '../../hooks/useIgnoreFollowRequest';
import { GET_PERSON_FOLLOW_STATE } from '../../hooks/useFollowPerson';

const PERSON_ID = uniqueId('Person:');
const FOLLOWING_CURRENT_USER_ID = uniqueId('Follow:');

const ignoreFollowRequestMock = {
  request: {
    query: IGNORE_FOLLOW_REQUEST,
    variables: { personId: PERSON_ID },
  },
  result: {
    data: {
      ignoreFollowRequest: {
        id: FOLLOWING_CURRENT_USER_ID,
        state: 'DECLINED',
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

describe('PersonFollowingConnected/HideButton', () => {
  it('should render', async () => {
    let tree = await renderWithApolloData(
      <Providers
        MockedProvider={MockedProvider}
        mocks={[ignoreFollowRequestMock, followPersonMock]}
      >
        <HideButton personId={PERSON_ID} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
});
