import React from 'react';
import renderer from 'react-test-renderer';
import { Text } from 'react-native';

import { renderWithApolloData, Providers } from '../../testUtils';
import GET_USER_GENDER_AND_BIRTH_DATE from './getUserGenderAndBirthDate';
import AboutYouConnected from './AboutYouConnected';

describe('AboutYouConnected component', () => {
  it('renders in a default state', () => {
    const tree = renderer.create(
      <Providers>
        <AboutYouConnected
          onPressPrimary={jest.fn()}
          defaultDate={'2019-02-14T05:00:00.000Z'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders Gender and BirthDate when logged in', async () => {
    const mock = {
      request: {
        query: GET_USER_GENDER_AND_BIRTH_DATE,
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
              birthDate: '1980-02-10T05:00:00.000Z',
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
  it('should render a custom Component', async () => {
    const mock = {
      request: {
        query: GET_USER_GENDER_AND_BIRTH_DATE,
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
              birthDate: '1980-02-10T05:00:00.000Z',
            },
          },
        },
      },
    };

    const CustomComponent = ({ gender }) => <Text>{gender}</Text>; // eslint-disable-line react/prop-types

    const tree = await renderWithApolloData(
      <Providers mocks={[mock]}>
        <AboutYouConnected
          Component={CustomComponent}
          onPressPrimary={jest.fn()}
          defaultDate={'2019-02-14T05:00:00.000Z'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
