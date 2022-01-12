import dataSource from '../data-source';

describe('OneSignal', () => {
  it('sends a push notification to a user', async () => {
    // eslint-disable-next-line
    const OneSignal = new dataSource();
    OneSignal.post = jest.fn();
    OneSignal.context = {
      dataSources: {
        Config: {
          ONE_SIGNAL: {
            APP_ID: '123-xyz',
            REST_KEY: 'abcabcabc',
          },
        },
      },
    };

    await OneSignal.createNotification({
      toUserIds: [123456, 567],
      content: 'Welcome to the app!',
      heading: 'Welcome',
      subtitle: 'It will be fun!',
    });

    expect(OneSignal.post.mock.calls).toMatchSnapshot();
  });
  it('updates push settings', async () => {
    // eslint-disable-next-line
    const OneSignal = new dataSource();
    OneSignal.updateExternalUserId = jest.fn();
    OneSignal.context = {
      dataSources: {
        Config: {
          ONE_SIGNAL: {
            APP_ID: '123-xyz',
            REST_KEY: 'abcabcabc',
          },
        },
        Person: {
          getFromId: () => ({ id: 'user123' }),
          getCurrentPerson: () => ({
            primaryAliasId: 'user123',
            id: 'user123',
          }),
        },
        PersonalDevice: {
          updateNotificationsEnabled: jest.fn(),
          request: () => ({
            filter: () => ({
              first: () => ({
                primaryAliasId: 'user123',
              }),
            }),
          }),
        },
      },
    };

    await OneSignal.updatePushSettings({
      enabled: true,
      pushProviderUserId: '123',
    });

    expect(OneSignal.updateExternalUserId.mock.calls.length).toMatchSnapshot();
    expect(
      OneSignal.context.dataSources.PersonalDevice.updateNotificationsEnabled
        .mock.calls.length
    ).toMatchSnapshot();
  });
});
