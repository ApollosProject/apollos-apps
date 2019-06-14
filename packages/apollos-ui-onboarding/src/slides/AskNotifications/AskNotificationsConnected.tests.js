import React from 'react';
import renderer from 'react-test-renderer';
import { Text } from 'react-native';

import { GET_NOTIFICATIONS_ENABLED } from '@apollosproject/ui-notifications';
import { renderWithApolloData, Providers } from '../../testUtils';

import AskNotificationsConnected from './AskNotificationsConnected';

describe('The Onboarding AskNotificationsConnected component', () => {
  it('should render with a user not having granted push notifications permissions', async () => {
    const mocks = [
      {
        request: {
          query: GET_NOTIFICATIONS_ENABLED,
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
          query: GET_NOTIFICATIONS_ENABLED,
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
  it('should render a custom Component', async () => {
    const mocks = [
      {
        request: {
          query: GET_NOTIFICATIONS_ENABLED,
        },
        result: {
          data: { notificationsEnabled: true },
        },
      },
    ];

    const CustomComponent = (
      { buttonDisabled } // eslint-disable-line react/prop-types
    ) => (
      // `notificationsEnabled` is passed to the `buttonDisabled` prop thus it is equal to `true` from the mock query above.
      <Text>{`Skyline is better than Goldstar === ${buttonDisabled}`}</Text>
    );

    const tree = await renderWithApolloData(
      <Providers addTypename={false} mocks={mocks}>
        <AskNotificationsConnected
          Component={CustomComponent}
          onPressPrimary={jest.fn()}
        />
      </Providers>
    );
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
