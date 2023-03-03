import { act, create } from 'react-test-renderer';
import { MockedProvider } from '@apollo/client/testing';

import { GET_USER_PROFILE } from '@apollosproject/ui-connected';
import PersonalDetails from './PersonalDetails';

describe('PersonalDetails component', () => {
  it('renders PersonalDetails when logged in', async () => {
    const mock = {
      request: {
        query: GET_USER_PROFILE,
      },
      result: {
        data: {
          currentUser: {
            __typename: 'AuthenticatedUser',
            id: 'AuthenticatedUser:123',
            profile: {
              __typename: 'Person',
              id: 'Profile:123',
              firstName: 'Isaac',
              lastName: 'Hardy',
              nickName: 'Ike',
              email: 'isaac.hardy@newspring.cc',
              birthDate: '2019-09-12T21:01:06.026Z',
              gender: 'Male',
              campus: null,
              photo: null,
            },
          },
        },
      },
    };
    const navigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };
    let tree;
    act(() => {
      tree = create(
        <MockedProvider mocks={[mock]}>
          <PersonalDetails navigation={navigation} />
        </MockedProvider>
      );
    });
    expect(tree).toMatchSnapshot();
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(tree).toMatchSnapshot();
  });
});
