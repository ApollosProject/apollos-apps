import React from 'react';
import gql from 'graphql-tag';
import { renderWithApolloData, Providers } from '../testUtils';
import RockAuthedWebView from '.';

const mocks = [
  {
    request: {
      query: gql`
        query UserToken {
          currentUser {
            id
            rock {
              authCookie
            }
          }
        }
      `,
    },
    result: {
      data: {
        __typename: 'AuthenticatedUser',
        currentUser: {
          __typename: 'Person',
          id: 'Person:123',
          rock: {
            __typename: 'RockPersonDetails',
            authCookie: 'ABC',
          },
        },
      },
    },
  },
];

describe('the RockAuthedWebView component', () => {
  it('renders with a user', async () => {
    const tree = await renderWithApolloData(
      <Providers mocks={mocks}>
        <RockAuthedWebView
          navigation={{ navigate: jest.fn(), pop: jest.fn() }}
          route={{ params: { url: 'google.com' } }}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
