import React from 'react';

import { Providers, renderWithApolloData } from '@apollosproject/ui-test-utils';
import { MockedProvider } from '@apollo/client/testing';

import GET_MESSAGE from './getMessage';
import MessageConnected from '.';

describe('MessageConnected', () => {
  it('should render', async () => {
    const mock = {
      request: {
        query: GET_MESSAGE,
        variables: { nodeId: 'Message:123' },
      },
      result: {
        data: {
          node: {
            __typename: 'Message',
            id: 'Message:123',
            htmlContent: '<h1>This is a title</h1><p>This is the body</>',
          },
        },
      },
    };

    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={[mock]}>
        <MessageConnected nodeId={'Message:123'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
