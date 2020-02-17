import React from 'react';
import { Providers, renderWithApolloData } from '../utils/testUtils';

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
                __typename: 'ImageMedia',
              },
            },
          },
        },
      },
    };
    const navigation = { navigate: jest.fn(), getParam: jest.fn() };
    const tree = await renderWithApolloData(
      <Providers mocks={[mock]}>
        <UserAvatarConnected navigation={navigation} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
});
