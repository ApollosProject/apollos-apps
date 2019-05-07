import React from 'react';
import renderer from 'react-test-renderer';
import { renderWithApolloData, Providers } from '../../testUtils';
import getNotificationsEnabled from './getNotificationsEnabled';

import AskNotificationsConnected from './AskNotificationsConnected';

describe('The Onboarding AskNotificationsConnected component', () => {
  it('should render with a user not having granted push notifications permissions', async () => {
    const mocks = [
      {
        request: {
          query: getNotificationsEnabled,
        },
        result: {
          data: { notificationsEnabled: false },
        },
      },
    ];

    const component = (
      <Providers mocks={mocks} addTypename={false}>
        <AskNotificationsConnected onPressPrimary={jest.fn()} />
      </Providers>
    );

    const tree = await renderWithApolloData(component);
    expect(tree).toMatchSnapshot();
  });
  it('should render as if a user had granted push notifications permissions', async () => {
    const mocks = [
      {
        request: {
          query: getNotificationsEnabled,
        },
        result: {
          data: { notificationsEnabled: true },
        },
      },
    ];
    const component = (
      <Providers addTypename={false} mocks={mocks}>
        <AskNotificationsConnected onPressPrimary={jest.fn()} />
      </Providers>
    );

    const tree = await renderWithApolloData(component);
    expect(tree).toMatchSnapshot();
  });

  it('should render with no data in the cache', () => {
    const tree = renderer.create(
      <Providers>
        <AskNotificationsConnected />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
