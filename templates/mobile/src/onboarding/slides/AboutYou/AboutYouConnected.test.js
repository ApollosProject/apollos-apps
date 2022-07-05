import renderer from 'react-test-renderer';

import { MockedProvider } from '@apollo/client/testing';
import GET_USER_GENDER_AND_BIRTH_DATE from './getUserGenderAndBirthDate';
import AboutYouConnected from './AboutYouConnected';

describe('AboutYouConnected component', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2019-02-14T05:00:00.000Z'));
  });
  afterAll(() => {
    jest.useRealTimers();
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
      <MockedProvider mocks={[mock]}>
        <AboutYouConnected
          onPressPrimary={jest.fn()}
          defaultDate={new Date('2019-02-14T05:00:00.000Z')}
        />
      </MockedProvider>
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders Gender and BirthDate when logged in', () => {
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
      <MockedProvider mocks={[mock]}>
        <AboutYouConnected setFieldValue={jest.fn()} />
      </MockedProvider>
    );
    renderer.act(() => {
      jest.advanceTimersByTime(10);
    });
    expect(tree).toMatchSnapshot();
  });
});
