import { fetch } from 'apollo-server-env';
import ApollosConfig from '@apollosproject/config';
import { buildGetMock } from '../../test-utils';

import ContentItemsDataSource from '../data-source';

ApollosConfig.loadJs({
  ROCK: {
    API_URL: 'https://apollosrock.newspring.cc/api',
    API_TOKEN: 'some-rock-token',
    IMAGE_URL: 'https://apollosrock.newspring.cc/GetImage.ashx',
    TIMEZONE: 'America/New_York',
  },
  ROCK_MAPPINGS: {
    SERMON_CHANNEL_ID: 'TEST_ID',
  },
});

const RealDate = Date;

function mockDate(isoDate) {
  global.Date = class extends RealDate {
    constructor() {
      return new RealDate(isoDate);
    }
  };
}

describe('ContentItemsModel', () => {
  beforeEach(() => {
    mockDate('2017-11-25T12:34:56z');
    fetch.resetMocks();
  });
  afterEach(() => {
    global.Date = RealDate;
  });
  it('constructs', () => {
    expect(new ContentItemsDataSource()).toBeTruthy();
  });
  it('filters by content channel id', () => {
    const dataSource = new ContentItemsDataSource();
    dataSource.get = buildGetMock([{ Id: 1 }, { Id: 2 }], dataSource);
    const result = dataSource.byContentChannelId(1).get();
    expect(result).resolves.toMatchSnapshot();
    expect(dataSource.get.mock.calls).toMatchSnapshot();
  });

  it('gets by id', () => {
    const dataSource = new ContentItemsDataSource();
    dataSource.get = buildGetMock({ Id: 1 }, dataSource);
    const result = dataSource.getFromId(1);
    expect(result).resolves.toMatchSnapshot();
    expect(dataSource.get.mock.calls).toMatchSnapshot();
  });

  it('gets by ids', () => {
    const dataSource = new ContentItemsDataSource();
    dataSource.get = buildGetMock([{ Id: 1 }, { Id: 2 }], dataSource);
    const result = dataSource.getFromIds([1, 2]).get();
    expect(result).resolves.toMatchSnapshot();
    expect(dataSource.get.mock.calls).toMatchSnapshot();
  });

  it('returns an empty array when calling getByIds with no ids', () => {
    const dataSource = new ContentItemsDataSource();
    dataSource.get = jest.fn();
    const result = dataSource.getFromIds([]).get();
    expect(result).resolves.toEqual([]);
    expect(dataSource.get.mock.calls.length).toEqual(0);
  });

  it('gets a cursor finding child content items of a provided parent', async () => {
    const dataSource = new ContentItemsDataSource();
    dataSource.get = buildGetMock(
      [
        [
          { ChildContentChannelItemId: 101 },
          { ChildContentChannelItemId: 201 },
        ],
        [{ Id: 1 }, { Id: 2 }],
      ],
      dataSource
    );
    const cursor = await dataSource.getCursorByParentContentItemId(1);
    expect(cursor.get()).resolves.toMatchSnapshot();
    expect(dataSource.get.mock.calls).toMatchSnapshot();
  });

  it('returns null when there are no child content items', async () => {
    const dataSource = new ContentItemsDataSource();
    dataSource.get = buildGetMock([], dataSource);
    const cursor = await dataSource.getCursorByParentContentItemId(1);
    expect(cursor).toBe(null);
    expect(dataSource.get.mock.calls).toMatchSnapshot();
  });

  it('gets a cursor finding parent content items of a provided child', async () => {
    const dataSource = new ContentItemsDataSource();
    dataSource.get = buildGetMock(
      [
        [{ ContentChannelItemId: 101 }, { ContentChannelItemId: 201 }],
        [{ Id: 1 }, { Id: 2 }],
      ],
      dataSource
    );
    const cursor = await dataSource.getCursorByChildContentItemId(1);
    expect(cursor.get()).resolves.toMatchSnapshot();
    expect(dataSource.get.mock.calls).toMatchSnapshot();
  });

  it('gets a cursor finding sibling content items of a provided item', async () => {
    const dataSource = new ContentItemsDataSource();
    dataSource.get = buildGetMock(
      [
        [{ ContentChannelItemId: 101 }],
        [
          { ContentChannelId: 201, ChildContentChannelItemId: 1 },
          { ContentChannelId: 202, ChildContentChannelItemId: 2 },
        ],
        [{ Id: 1 }, { Id: 2 }],
      ],
      dataSource
    );
    const cursor = await dataSource.getCursorBySiblingContentItemId(1);
    expect(cursor.get()).resolves.toMatchSnapshot();
    expect(dataSource.get.mock.calls).toMatchSnapshot();
  });

  it('returns null when there are no parent content items', async () => {
    const dataSource = new ContentItemsDataSource();
    dataSource.get = buildGetMock([], dataSource);
    const cursor = await dataSource.getCursorByChildContentItemId(1);
    expect(cursor).toBe(null);
    expect(dataSource.get.mock.calls).toMatchSnapshot();
  });

  it('returns a text feature when a contentItem has a TextFeature field', async () => {
    const dataSource = new ContentItemsDataSource();
    const createTextFeature = jest.fn(() => ({
      id: 'TextFeature:123',
      body: 'something',
    }));
    dataSource.context = { dataSources: { Features: { createTextFeature } } };
    const result = dataSource.getFeatures({
      attributeValues: { textFeature: { id: 123, value: 'something' } },
    });
    expect(result).toMatchSnapshot();
    expect(createTextFeature.mock.calls).toMatchSnapshot();
  });

  it('returns an empty array when there are no features', async () => {
    const dataSource = new ContentItemsDataSource();
    const createTextFeature = jest.fn(() => ({
      id: 'TextFeature:123',
      body: 'something',
    }));
    dataSource.context = { dataSources: { Features: { createTextFeature } } };
    const result = dataSource.getFeatures({
      attributeValues: { textFeature: { id: 123, value: '' } },
    });
    expect(result).toMatchSnapshot();
    expect(createTextFeature.mock.calls).toMatchSnapshot();
  });

  it('isContentActiveLiveStream returns false if the livestream is innactive', async () => {
    const dataSource = new ContentItemsDataSource();
    dataSource.context = {
      dataSources: { LiveStream: { getLiveStream: () => ({ isLive: false }) } },
    };
    dataSource.getSermonFeed = jest.fn();

    const result = await dataSource.isContentActiveLiveStream({ id: '1' });
    expect(result).toBe(false);
    expect(dataSource.getSermonFeed.mock.calls).toMatchSnapshot();
  });

  it('isContentActiveLiveStream returns false if the livestream is not the most recent sermon', async () => {
    const dataSource = new ContentItemsDataSource();
    dataSource.context = {
      dataSources: { LiveStream: { getLiveStream: () => ({ isLive: true }) } },
    };
    dataSource.getSermonFeed = jest.fn(() => ({
      first: () => Promise.resolve({ id: '2' }),
    }));

    const result = await dataSource.isContentActiveLiveStream({ id: '1' });
    expect(result).toBe(false);
    expect(dataSource.getSermonFeed.mock.calls).toMatchSnapshot();
  });

  it('isContentActiveLiveStream returns true if the livestream is the most recent sermon', async () => {
    const dataSource = new ContentItemsDataSource();
    dataSource.context = {
      dataSources: { LiveStream: { getLiveStream: () => ({ isLive: true }) } },
    };
    dataSource.getSermonFeed = jest.fn(() => ({
      first: () => Promise.resolve({ id: '1' }),
    }));

    const result = await dataSource.isContentActiveLiveStream({ id: '1' });
    expect(result).toBe(true);
    expect(dataSource.getSermonFeed.mock.calls).toMatchSnapshot();
  });

  it('getSermonFeed fetches items from a specific content channel', () => {
    const dataSource = new ContentItemsDataSource();
    dataSource.byContentChannelId = jest.fn(
      () => new Promise((resolve) => resolve)
    );

    const result = dataSource.getSermonFeed({ id: '1' });
    expect(dataSource.byContentChannelId.mock.calls).toMatchSnapshot();
    expect(result).toMatchSnapshot();
  });

  it('returns null when there are no parent content items with images', async () => {
    const dataSource = new ContentItemsDataSource();
    dataSource.getCursorByChildContentItemId = () => ({
      get: () => Promise.resolve([{ attributeValues: {}, attributes: {} }]),
    });

    const image = await dataSource.getCoverImage({
      attributeValues: {},
      attributes: {},
    });

    expect(image).toBe(null);
  });
});
