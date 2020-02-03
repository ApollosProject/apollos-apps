import React from 'react';
import renderer from 'react-test-renderer';
import wait from 'waait';

import { Providers } from '../utils/testUtils';
import GET_USER_PHOTO from './getUserPhoto';

import UserAvatarConnected from '.';

describe('UserAvatarConnected component', () => {
  it('renders UserAvatarConnected', async () => {
    const mock = {
      request: {
        query: GET_USER_PHOTO,
      },
      result: {
        data: {
          currentUser: {
            __typename: 'AuthenticatedUser',
            id: 'AuthenticatedUser:123',
            profile: {
              __typename: 'Person',
              id: 'Person:123',
              photo: {
                uri: 'https://www.placecage.com/300/300',
              },
            },
          },
        },
      },
    };
    const navigation = { navigate: jest.fn(), getParam: jest.fn() };
    const tree = renderer.create(
      <Providers mocks={[mock]}>
        <UserAvatarConnected navigation={navigation} />
      </Providers>
    );
    await wait(0); // wait for response from graphql
    expect(tree).toMatchSnapshot();
  });
});
