import renderer from 'react-test-renderer';

import { PushContext } from '@apollosproject/ui-notifications';

import AskNotificationsConnected from './AskNotificationsConnected';

describe('The Onboarding AskNotificationsConnected component', () => {
  it('should render with a user not having granted push notifications permissions', async () => {
    const tree = (
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
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render as if a user had granted push notifications permissions', async () => {
    const tree = (
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
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render with no data in the cache', () => {
    const tree = renderer.create(
      <AskNotificationsConnected onRequestPushPermissions={jest.fn()} />
    );
    expect(tree).toMatchSnapshot();
  });
});
