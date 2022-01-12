import { dataSource as ConfigDataSource } from '@apollosproject/config';
import EventsDataSource from '../data-source';

describe('Events', () => {
  it('should return start and end based on a schedule', async () => {
    const Event = new EventsDataSource();
    const Config = new ConfigDataSource();
    Config.initialize({ context: { church: { slug: 'apollos_demo' } } });
    Event.context = { dataSources: { Config } };

    const result = await Event.getDateTime({
      iCalendarContent:
        'BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nDTEND:20130501T190000\r\nDTSTART:20130501T180000\r\nRRULE:FREQ=WEEKLY;BYDAY=SA\r\nEND:VEVENT\r\nEND:VCALENDAR',
    });
    expect(result).toMatchSnapshot();
  });

  it('should return a name based on an EventItem', async () => {
    const Event = new EventsDataSource();

    Event.get = jest.fn(() =>
      Promise.resolve({
        name: 'some event',
      })
    );

    const result = await Event.getName({ eventItemId: 123 });
    expect(result).toEqual('some event');
    expect(Event.get.mock.calls).toMatchSnapshot();
  });

  it('should return a description based on an EventItem', async () => {
    const Event = new EventsDataSource();

    Event.get = jest.fn(() =>
      Promise.resolve({
        description: 'some description',
      })
    );

    const result = await Event.getDescription({ eventItemId: 123 });
    expect(result).toEqual('some description');
    expect(Event.get.mock.calls).toMatchSnapshot();
  });

  it('should return an image based on an EventItem', async () => {
    const Event = new EventsDataSource();

    Event.get = jest.fn(() =>
      Promise.resolve({
        name: 'some event',
      })
    );

    const imageUrl = jest.fn(() => Promise.resolve('https://example.com'));

    Event.context = {
      dataSources: { BinaryFiles: { findOrReturnImageUrl: imageUrl } },
    };

    const result = await Event.getImage({ eventItemId: 123 });
    expect(result).toMatchSnapshot();
    expect(Event.get.mock.calls).toMatchSnapshot();
    expect(imageUrl.mock.calls).toMatchSnapshot();
  });

  it('should get by Campus', async () => {
    const Event = new EventsDataSource();
    const Config = new ConfigDataSource();
    Config.initialize({ context: { church: { slug: 'apollos_demo' } } });
    Event.context = { dataSources: { Config } };

    Event.get = jest.fn(() =>
      Promise.resolve([
        {
          id: 123,
          name: 'some event',
        },
      ])
    );

    const result = await Event.getByCampus(456);
    expect(result).toMatchSnapshot();
    expect(Event.get.mock.calls).toMatchSnapshot();
  });

  it('should get all recent events', async () => {
    const Event = new EventsDataSource();
    const Config = new ConfigDataSource();
    Config.initialize({ context: { church: { slug: 'apollos_demo' } } });
    Event.context = { dataSources: { Config } };

    Event.get = jest.fn(() =>
      Promise.resolve([
        {
          id: 123,
          name: 'some event',
        },
      ])
    );

    const result = await Event.findRecent().get();
    expect(result).toMatchSnapshot();
    expect(Event.get.mock.calls).toMatchSnapshot();
  });

  it('should get all recent events using the plugin', async () => {
    const Event = new EventsDataSource();
    const Config = new ConfigDataSource();
    Config.initialize({ context: { church: { slug: 'apollos_demo' } } });
    Config.config.loadJs({
      ROCK: { USE_PLUGIN: true },
    });
    Event.context = { dataSources: { Config } };

    Event.get = jest.fn(() =>
      Promise.resolve([
        {
          id: 123,
          name: 'some event',
        },
      ])
    );

    const result = await Event.findRecent().get();
    expect(result).toMatchSnapshot();
    expect(Event.get.mock.calls).toMatchSnapshot();
    Config.config.loadJs({
      ROCK: { USE_PLUGIN: false },
    });
  });

  it('should get from id', async () => {
    const Event = new EventsDataSource();

    Event.get = jest.fn(() =>
      Promise.resolve({
        id: 123,
        name: 'some event',
      })
    );

    const result = await Event.getFromId(123);
    expect(result).toMatchSnapshot();
    expect(Event.get.mock.calls).toMatchSnapshot();
  });
});
