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
const navigation = { navigate: jest.fn(), getParam: jest.fn() };

describe('the RockAuthedWebView component', () => {
  it('renders with a user', async () => {
    const tree = await renderWithApolloData(
      <Providers mocks={mocks}>
        <RockAuthedWebView navigation={navigation} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders with modal false', async () => {
    const tree = await renderWithApolloData(
      <Providers mocks={mocks}>
        <RockAuthedWebView modal={false} navigation={navigation} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
