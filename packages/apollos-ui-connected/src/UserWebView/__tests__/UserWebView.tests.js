import React from 'react';
import { renderWithApolloData, Providers } from '../../utils/testUtils';
import UserWebView, { WITH_USER_COOKIE, OpenUserWebView } from '../index';

const mocks = [
  {
    request: { query: WITH_USER_COOKIE },
    result: {
      data: {
        __typename: 'AuthenticatedUser',
        currentUser: {
          __typename: 'Person',
          id: 'Person:123',
          rockToken: 'ABC',
        },
      },
    },
  },
];
const navigation = { navigate: jest.fn(), getParam: jest.fn() };

describe('the UserWebView component', () => {
  it('renders with a user', async () => {
    const tree = await renderWithApolloData(
      <Providers mocks={mocks}>
        <UserWebView navigation={navigation} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders with modal false', async () => {
    const tree = await renderWithApolloData(
      <Providers mocks={mocks}>
        <UserWebView modal={false} navigation={navigation} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
describe('the OpenUserWebView', () => {
  jest.mock('NavigationService');
  it('navigtes', () => {
    OpenUserWebView({ url: 'fake.com', navigation });
    expect(navigation.navigate).toBeCalledWith('UserWebView', {
      url: 'fake.com',
      navigation,
    });
  });
});
