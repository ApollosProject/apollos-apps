import React from 'react';
import { Providers, renderWithApolloData } from '@apollosproject/ui-test-utils';
import { MockedProvider } from '@apollo/client/testing';

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
              firstName: 'George',
              lastName: 'Costanaza',
              photo: {
                uri:
                  'https://res.cloudinary.com/apollos/image/fetch/c_limit,f_auto,w_1600/https://apollosrock.newspring.cc/GetImage.ashx%3Fguid%3D31af1a61-360c-4b1e-8e62-45517c06a9a2',
                __typename: 'ImageMedia',
              },
            },
          },
        },
      },
    };
    const navigation = { navigate: jest.fn() };
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={[mock]}>
        <UserAvatarConnected navigation={navigation} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders UserAvatarConnected without a photo', async () => {
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
              firstName: 'George',
              lastName: 'Costanaza',
              photo: null,
            },
          },
        },
      },
    };
    const navigation = { navigate: jest.fn() };
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={[mock]}>
        <UserAvatarConnected navigation={navigation} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
