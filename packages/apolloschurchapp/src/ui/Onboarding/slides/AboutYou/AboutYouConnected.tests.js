import React from 'react';
import Providers from 'apolloschurchapp/src/Providers';

import { renderWithApolloData } from 'apolloschurchapp/src/utils/testUtils';
import getUserProfile from '../../../../tabs/connect/getUserProfile';
import AboutYouConnected from './AboutYouConnected';

describe('AboutYouConnected component', () => {
  it('renders Gender and BirthDate when logged in', async () => {
    const mock = {
      request: {
        query: getUserProfile,
      },
      result: {
        data: {
          currentUser: {
            __typename: 'AuthenticatedUser',
            id: 'AuthenticatedUser:123',
            profile: {
              __typename: 'Person',
              gender: 'Male',
              birthDate: '1980-02-10T00:00:00',
              firstName: 'Isaac',
              lastName: 'Hardy',
              campus: {
                __typename: 'Campus',
                name: 'Coolest Campus',
              },
              email: 'isaac.hardy@newspring.cc',
              nickName: 'Batman',
              photo: {
                __typename: 'ImageMediaSource',
                uri: 'https://some-uri.com/test.jpg',
              },
            },
          },
        },
      },
    };
    const tree = await renderWithApolloData(
      <Providers mocks={[mock]}>
        <AboutYouConnected setFieldValue={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
