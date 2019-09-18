import ApollosConfig from '@apollosproject/config';
import EventsDataSource from '../data-source';

ApollosConfig.loadJs({
  ROCK: {
    API_URL: 'https://apollosrock.newspring.cc/api',
    API_TOKEN: 'some-rock-token',
    IMAGE_URL: 'https://apollosrock.newspring.cc/GetImage.ashx',
    SHARE_URL: 'https://apollosrock.newspring.cc',
    TIMEZONE: 'America/New_York',
  },
  ROCK_MAPPINGS: {
    SERMON_CHANNEL_ID: 'TEST_ID',
  },
});

describe('Events', () => {
  it('should return start and end based on a schedule', async () => {
    const Events = new EventsDataSource();

    const result = await Events.getDateTime({
      iCalendarContent:
        'BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nDTEND:20130501T190000\r\nDTSTART:20130501T180000\r\nRRULE:FREQ=WEEKLY;BYDAY=SA\r\nEND:VEVENT\r\nEND:VCALENDAR',
    });
    expect(result).toMatchSnapshot();
  });

  it('should return a name based on an EventItem', async () => {
    const Events = new EventsDataSource();

    Events.get = jest.fn(() =>
      Promise.resolve({
        name: 'some event',
      })
    );

    const result = await Events.getName({ eventItemId: 123 });
    expect(result).toEqual('some event');
    expect(Events.get.mock.calls).toMatchSnapshot();
  });

  it('should return a name based on an EventItem', async () => {
    const Events = new EventsDataSource();

    Events.get = jest.fn(() =>
      Promise.resolve({
        name: 'some event',
      })
    );

    const result = await Events.getName({ eventItemId: 123 });
    expect(result).toEqual('some event');
    expect(Events.get.mock.calls).toMatchSnapshot();
  });

  it('should return an image based on an EventItem', async () => {
    const Events = new EventsDataSource();

    Events.get = jest.fn(() =>
      Promise.resolve({
        name: 'some event',
      })
    );

    const imageUrl = jest.fn(() => Promise.resolve('https://example.com'));

    Events.context = {
      dataSources: { BinaryFiles: { findOrReturnImageUrl: imageUrl } },
    };

    const result = await Events.getImage({ eventItemId: 123 });
    expect(result).toMatchSnapshot();
    expect(Events.get.mock.calls).toMatchSnapshot();
    expect(imageUrl.mock.calls).toMatchSnapshot();
  });

  it('should get by Campus', async () => {
    const Events = new EventsDataSource();

    Events.get = jest.fn(() =>
      Promise.resolve([
        {
          id: 123,
          name: 'some event',
        },
      ])
    );

    const result = await Events.getByCampus(456);
    expect(result).toMatchSnapshot();
    expect(Events.get.mock.calls).toMatchSnapshot();
  });

  it('should get all recent events', async () => {
    const Events = new EventsDataSource();

    Events.get = jest.fn(() =>
      Promise.resolve([
        {
          id: 123,
          name: 'some event',
        },
      ])
    );

    const result = await Events.findRecent().get();
    expect(result).toMatchSnapshot();
    expect(Events.get.mock.calls).toMatchSnapshot();
  });

  it('should get all recent events using the plugin', async () => {
    ApollosConfig.loadJs({
      ROCK: { USE_PLUGIN: true },
    });
    const Events = new EventsDataSource();

    Events.get = jest.fn(() =>
      Promise.resolve([
        {
          id: 123,
          name: 'some event',
        },
      ])
    );

    const result = await Events.findRecent().get();
    expect(result).toMatchSnapshot();
    expect(Events.get.mock.calls).toMatchSnapshot();
    ApollosConfig.loadJs({
      ROCK: { USE_PLUGIN: false },
    });
  });

  it('should get by id', async () => {
    const Events = new EventsDataSource();

    Events.get = jest.fn(() =>
      Promise.resolve({
        id: 123,
        name: 'some event',
      })
    );

    const result = await Events.getById(123);
    expect(result).toMatchSnapshot();
    expect(Events.get.mock.calls).toMatchSnapshot();
  });
});
