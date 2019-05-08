import React from 'react';
import renderer from 'react-test-renderer';

import { renderWithApolloData, Providers } from '../../testUtils';
import getUserGenderAndBirthDate from './getUserGenderAndBirthDate';
import AboutYouConnected from './AboutYouConnected';

describe('AboutYouConnected component', () => {
  it('renders in a default state', () => {
    const tree = renderer.create(
      <Providers>
        <AboutYouConnected
          onPressPrimary={jest.fn()}
          defaultDate={'2019-02-14'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders Gender and BirthDate when logged in', async () => {
    const mock = {
      request: {
        query: getUserGenderAndBirthDate,
      },
      result: {
        data: {
          currentUser: {
            __typename: 'AuthenticatedUser',
            id: 'AuthenticatedUser:123',
            profile: {
              __typename: 'Person',
              id: 'Person:123',
              gender: 'Male',
              birthDate: '1980-02-10T00:00:00',
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
