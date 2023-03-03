import { act, create } from 'react-test-renderer';

import { MockedProvider } from '@apollo/client/testing';

import GET_USER_FIRST_NAME from './getUserFirstName';
import FeaturesConnected from './FeaturesConnected';

describe('The Onboarding FeaturesConnected component', () => {
  it('should render with a firstName when logged in', async () => {
    const mock = {
      request: {
        query: GET_USER_FIRST_NAME,
      },
      result: {
        data: {
          currentUser: {
            __typename: 'AuthenticatedUser',
            id: 'AuthenticatedUser:123',
            profile: {
              __typename: 'Person',
              id: 'Person:123',
              firstName: 'Marty',
            },
          },
        },
      },
    };

    let tree;
    act(() => {
      tree = create(
        <MockedProvider mocks={[mock]}>
          <FeaturesConnected />
        </MockedProvider>
      );
    });
    expect(tree).toMatchSnapshot();
    await act(async () => {
      await new Promise((res) => setTimeout(res, 0));
    });
    expect(tree).toMatchSnapshot();
  });
});
