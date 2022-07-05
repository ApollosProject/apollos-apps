import renderer from 'react-test-renderer';

import { MockedProvider } from '@apollo/client/testing';

import getUserFirstAndLastName from './getUserFirstAndLastName';
import AskNameConnected from './AskNameConnected';

const mock = {
  request: {
    query: getUserFirstAndLastName,
  },
  result: {
    data: {
      currentUser: {
        __typename: 'AuthenticatedUser',
        id: 'AuthenticatedUser:123',
        profile: {
          __typename: 'Person',
          id: 'Person:123',
          firstName: 'Isaac',
          lastName: 'Hardy',
        },
      },
    },
  },
};

describe('The AskNameConnected component', () => {
  it('renders', async () => {
    let tree;
    renderer.act(() => {
      tree = renderer.create(
        <MockedProvider mocks={[mock]}>
          <AskNameConnected onPressPrimary={jest.fn()} />
        </MockedProvider>
      );
    });
    expect(tree).toMatchSnapshot();
    await renderer.act(async () => {
      await new Promise((res) => setTimeout(res, 0));
    });
    expect(tree).toMatchSnapshot();
  });
});
