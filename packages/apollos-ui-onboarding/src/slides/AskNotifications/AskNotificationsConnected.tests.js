import React from 'react';
import renderer from 'react-test-renderer';
import { Text } from 'react-native';

import { PushContext } from '@apollosproject/ui-notifications';
import { Providers, renderWithApolloData } from '@apollosproject/ui-test-utils';
import { MockedProvider } from '@apollo/client/testing';

import AskNotificationsConnected from './AskNotificationsConnected';

describe('The Onboarding AskNotificationsConnected component', () => {
  it('should render with a user not having granted push notifications permissions', async () => {
    const component = (
      <Providers MockedProvider={MockedProvider}>
        <PushContext.Provider
          value={{
            loading: false,
            hasPushPermission: false,
            hasPrompted: false,
            checkPermissions: () => ({}),
          }}
        >
          <AskNotificationsConnected
            onPressPrimary={jest.fn()}
            onRequestPushPermissions={jest.fn()}
          />
        </PushContext.Provider>
      </Providers>
    );

    const tree = await renderWithApolloData(component);
    expect(tree).toMatchSnapshot();
  });
  it('should render as if a user had granted push notifications permissions', async () => {
    const component = (
      <Providers MockedProvider={MockedProvider}>
        <PushContext.Provider
          value={{
            loading: false,
            hasPushPermission: true,
            hasPrompted: true,
            checkPermissions: () => ({}),
          }}
        >
          <AskNotificationsConnected
            onPressPrimary={jest.fn()}
            onRequestPushPermissions={jest.fn()}
          />
        </PushContext.Provider>
      </Providers>
    );

    const tree = await renderWithApolloData(component);
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom Component', async () => {
    const CustomComponent = (
      { buttonDisabled } // eslint-disable-line react/prop-types
    ) => (
      // `notificationsEnabled` is passed to the `buttonDisabled` prop thus it is equal to `true` from the mock query above.
      <Text>{`Skyline is better than Goldstar === ${buttonDisabled}`}</Text>
    );

    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider}>
        <AskNotificationsConnected
          Component={CustomComponent}
          onPressPrimary={jest.fn()}
          onRequestPushPermissions={jest.fn()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with no data in the cache', () => {
    const tree = renderer.create(
      <Providers MockedProvider={MockedProvider}>
        <AskNotificationsConnected onRequestPushPermissions={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
