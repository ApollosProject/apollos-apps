import React from 'react';
import renderer from 'react-test-renderer';
import wait from 'waait';

import Providers from 'apolloschurchapp/src/Providers';

import getUserProfile from '../../../../tabs/connect/getUserProfile';
import AboutYouConnected from './AboutYouConnected';

describe('PersonalDetails component', () => {
  it('renders Gender and BirthDate when logged in', async () => {
    const mock = {
      request: {
        query: getUserProfile,
      },
      result: {
        data: {
          currentUser: {
            profile: {
              birthDate: '01/12/2001',
            },
          },
        },
      },
    };
    const tree = renderer.create(
      <Providers mocks={[mock]}>
        <AboutYouConnected />
      </Providers>
    );
    await wait(0); // wait for response from graphql
    expect(tree).toMatchSnapshot();
  });
});
