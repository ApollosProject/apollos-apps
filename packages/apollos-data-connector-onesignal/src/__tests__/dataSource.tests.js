import Config from '@apollosproject/config';
import { dataSource } from '../index';

Config.loadJs({
  ONE_SIGNAL: {
    APP_ID: 'bla-bla-bla-app-id',
  },
  ROCK_MAPPINGS: {
    CONTENT_ITEM: {
      ContentSeriesContentItem: {
        EntityType: 'ContentChannelItem',
      },
      DevotionalContentItem: {
        EntityType: 'SomeOtherEntity',
      },
      MediaContentItem: {
        EntityType: 'ContentChannelItem',
      },
      UniversalContentItem: {
        EntityType: 'ContentChannelItem',
      },
      WeekendContentItem: {
        EntityType: 'ContentChannelItem',
      },
      ContentItem: {
        EntityType: 'ContentChannelItem',
      },
    },
  },
});

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
