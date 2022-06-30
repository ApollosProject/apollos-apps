import { create, act } from 'react-test-renderer';
import { gql } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';

import UserSettings from './UserSettings';

const mock = {
  request: {
    query: gql`
      query currentUserId {
        currentUser {
          id
        }
      }
    `,
  },
  result: {
    data: {
      currentUser: {
        id: 1,
      },
    },
  },
};

describe('UserSettings component', () => {
  it('renders UserSettings when logged in', async () => {
    let tree;
    act(() => {
      tree = create(
        <MockedProvider mocks={[mock]}>
          <UserSettings />
        </MockedProvider>
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(tree).toMatchSnapshot();
  });
});
