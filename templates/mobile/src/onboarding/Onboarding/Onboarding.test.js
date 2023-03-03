import renderer from 'react-test-renderer';
import { gql } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';

import Onboarding from './index';

const mocks = [
  {
    request: {
      query: gql`
        {
          currentUser {
            id
          }
        }
      `,
    },
    result: { data: { currentUser: 'User:123' } },
  },
];

describe('the Onboarding component', () => {
  it('should render Onboarding', async () => {
    const tree = renderer.create(
      <MockedProvider mocks={mocks}>
        <Onboarding />
      </MockedProvider>
    );
    expect(tree).toMatchSnapshot();
    await renderer.act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
    });
    expect(tree).toMatchSnapshot();
  });
});
