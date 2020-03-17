import React from 'react';
import { renderWithApolloData, Providers } from '../utils/testUtils';
import RockAuthedWebView, { GET_USER_COOKIE, OpenWebView } from '.';

const mocks = [
  {
    request: { query: GET_USER_COOKIE },
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
describe('the OpenUserWebView', () => {
  it('navigates', () => {
    OpenWebView({ url: 'fake.com', navigation });
    expect(navigation.navigate).toBeCalledWith('RockAuthedWebView', {
      url: 'fake.com',
    });
  });
});
