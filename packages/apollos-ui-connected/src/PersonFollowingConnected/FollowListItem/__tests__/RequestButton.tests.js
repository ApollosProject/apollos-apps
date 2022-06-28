import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { MockedProvider } from '@apollo/client/testing';
import { Providers, renderWithApolloData } from '@apollosproject/ui-test-utils';
import uniqueId from 'lodash/uniqueId';

import RequestButton from '../RequestButton';
import { REQUEST_TO_FOLLOW } from '../../hooks/useRequestToFollow';

const PERSON_ID = uniqueId('Person:');
const CURRENT_USER_FOLLOWING_ID = uniqueId('Follow:');

const requestToFollowMock = {
  request: {
    query: REQUEST_TO_FOLLOW,
    variables: { personId: PERSON_ID },
  },
  result: {
    data: {
      ignoreFollowRequest: {
        id: CURRENT_USER_FOLLOWING_ID,
        state: 'REQUESTED',
      },
    },
  },
};

describe('PersonFollowingConnected/RequestButton', () => {
  it('should render', async () => {
    let tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={[requestToFollowMock]}>
        <RequestButton personId={PERSON_ID} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
});
