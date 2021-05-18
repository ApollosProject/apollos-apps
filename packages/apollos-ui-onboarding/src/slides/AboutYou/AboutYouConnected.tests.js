import React from 'react';
import renderer from 'react-test-renderer';
import { Text } from 'react-native';

import { renderWithApolloData, Providers } from '@apollosproject/ui-test-utils';
import { MockedProvider } from '@apollo/client/testing';
import GET_USER_GENDER_AND_BIRTH_DATE from './getUserGenderAndBirthDate';
import AboutYouConnected from './AboutYouConnected';

let realDateNow;

describe('AboutYouConnected component', () => {
  beforeAll(() => {
    realDateNow = Date.now.bind(global.Date);
    const dateNowStub = jest.fn(() => ({
      setFullYear: () => null,
      getFullYear: () => 2021,
      getMonth: () => 5,
      getDate: () => 17,
    }));
    global.Date.now = dateNowStub;
  });
  afterAll(() => {
    global.Date.now = realDateNow;
  });
  it('renders in a default state', () => {
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
    const tree = renderer.create(
      <Providers MockedProvider={MockedProvider} mocks={[mock]}>
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
      <Providers MockedProvider={MockedProvider} mocks={[mock]}>
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
      <Providers MockedProvider={MockedProvider} mocks={[mock]}>
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
