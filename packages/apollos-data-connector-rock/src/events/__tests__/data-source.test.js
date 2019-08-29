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

    Events.get = jest.fn(() =>
      Promise.resolve({
        iCalendarContent:
          'BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nDTEND:20130501T190000\r\nDTSTART:20130501T180000\r\nRRULE:FREQ=WEEKLY;BYDAY=SA\r\nEND:VEVENT\r\nEND:VCALENDAR',
      })
    );

    const result = await Events.getDateTime(123);
    expect(result).toMatchSnapshot();
    expect(Events.get.mock.calls).toMatchSnapshot();
  });

  it('should return a name based on an EventItem', async () => {
    const Events = new EventsDataSource();

    Events.get = jest.fn(() =>
      Promise.resolve({
        name: 'some event',
      })
    );

    const result = await Events.getName(123);
    expect(result).toEqual('some event');
    expect(Events.get.mock.calls).toMatchSnapshot();
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
