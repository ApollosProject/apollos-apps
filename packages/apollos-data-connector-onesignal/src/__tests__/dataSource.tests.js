import dataSource from '../data-source';

describe('OneSignal', () => {
  it('sends a push notification to a user', async () => {
    // eslint-disable-next-line
    const OneSignal = new dataSource();
    OneSignal.post = jest.fn();

    await OneSignal.createNotification({
      toUserIds: [123456, 567],
      content: 'Welcome to the app!',
      heading: 'Welcome',
      subtitle: 'It will be fun!',
    });

    expect(OneSignal.post.mock.calls).toMatchSnapshot();
  });
});
