import { fetch } from 'apollo-server-env';
import ApollosConfig from '@apollosproject/config';
import { buildGetMock } from '../../test-utils';

import ContentItemsDataSource from '../data-source';

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
  BIBLE_API: {
    BIBLE_ID: {
      ESV: 'some-bible-id',
    },
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
    ApollosConfig.loadJs({
      ROCK: {
        USE_PLUGIN: false,
        SHOW_INACTIVE_CONTENT: null,
      },
    });
  });
  it('constructs', () => {
    expect(new ContentItemsDataSource()).toBeTruthy();
  });

  it('creates a sharing URL with channel url and item slug', async () => {
    const dataSource = new ContentItemsDataSource();
    dataSource.context = {
      dataSources: {
        ContentChannel: {
          getFromId: jest.fn(() => ({
            itemUrl: '/news',
          })),
        },
      },
    };
    dataSource.get = jest.fn(() => ({ slug: 'cool-article' }));
    const result = 'https://apollorock.newspring.cc/news/cool-article';
    expect(
      dataSource.getShareUrl({ contentId: 'fakeId', channelId: 'fakeChannel' })
    ).resolves.toEqual(result);
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

  it('defaults to filtering content', async () => {
    const dataSource = new ContentItemsDataSource();
    dataSource.get = buildGetMock([{ Id: 1 }, { Id: 2 }], dataSource);
    await dataSource.getFromIds([1, 2]).get();
    expect(dataSource.get.mock.calls).toMatchSnapshot();
  });

  it('filters content when SHOW_INACTIVE_CONTENT is false', async () => {
    ApollosConfig.loadJs({
      ROCK: {
        SHOW_INACTIVE_CONTENT: false,
      },
    });
    const dataSource = new ContentItemsDataSource();
    dataSource.get = buildGetMock([{ Id: 1 }, { Id: 2 }], dataSource);
    await dataSource.getFromIds([1, 2]).get();
    expect(dataSource.get.mock.calls).toMatchSnapshot();
  });

  it(' does not filter content when SHOW_INACTIVE_CONTENT is true', async () => {
    ApollosConfig.loadJs({
      ROCK: {
        SHOW_INACTIVE_CONTENT: true,
      },
    });
    const dataSource = new ContentItemsDataSource();
    dataSource.get = buildGetMock([{ Id: 1 }, { Id: 2 }], dataSource);
    await dataSource.getFromIds([1, 2]).get();
    expect(dataSource.get.mock.calls).toMatchSnapshot();
  });

  it('gets by ids using Apollos Plugin', () => {
    ApollosConfig.loadJs({
      ROCK: {
        USE_PLUGIN: true,
      },
    });
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

  it('gets a cursor finding child content items of a provided parent when using Apollos Plugin', async () => {
    ApollosConfig.loadJs({
      ROCK: {
        USE_PLUGIN: true,
      },
    });
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

  it('returns an empty array when there are no child content items', async () => {
    const dataSource = new ContentItemsDataSource();
    dataSource.get = buildGetMock([], dataSource);
    const cursor = await dataSource.getCursorByParentContentItemId(1);
    expect(await cursor.get()).toEqual([]);
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

  it('gets a cursor finding parent content items of a provided child using the apollos plugin', async () => {
    ApollosConfig.loadJs({
      ROCK: {
        USE_PLUGIN: true,
      },
    });
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

  it('gets a cursor finding sibling content items of a provided item when using apollos plugin', async () => {
    ApollosConfig.loadJs({
      ROCK: {
        USE_PLUGIN: true,
      },
    });
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

  it('returns an empty array when there are no sibling content items', async () => {
    const dataSource = new ContentItemsDataSource();
    dataSource.get = buildGetMock([], dataSource);
    const cursor = await dataSource.getCursorBySiblingContentItemId(1);
    expect(await cursor.get()).toEqual([]);
    expect(dataSource.get.mock.calls).toMatchSnapshot();
  });

  it('returns an empty array when there are no parent content items', async () => {
    const dataSource = new ContentItemsDataSource();
    dataSource.get = buildGetMock([], dataSource);
    const cursor = await dataSource.getCursorByChildContentItemId(1);
    expect(await cursor.get()).toEqual([]);
    expect(dataSource.get.mock.calls).toMatchSnapshot();
  });

  it('returns features when a contentItem has a Features field', async () => {
    const dataSource = new ContentItemsDataSource();
    const createTextFeature = jest.fn(() => ({
      id: 'TextFeature:123',
      body: 'text feature',
    }));
    const createScriptureFeature = jest.fn(() => ({
      id: 'ScriptureFeature:123',
      reference: 'john 3',
    }));
    dataSource.context = {
      dataSources: { Features: { createTextFeature, createScriptureFeature } },
    };
    const result = dataSource.getFeatures({
      attributeValues: {
        features: {
          id: 123,
          value: 'scripture^john 3|text^text feature',
        },
      },
    });
    expect(result).toMatchSnapshot();
    expect(createTextFeature.mock.calls).toMatchSnapshot();
    expect(createScriptureFeature.mock.calls).toMatchSnapshot();
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

  it('returns text features when a contentItem has a TextFeatures field', async () => {
    const dataSource = new ContentItemsDataSource();
    const createTextFeature = jest.fn(() => ({
      id: 'TextFeature:123',
      body: 'something',
    }));
    dataSource.context = { dataSources: { Features: { createTextFeature } } };
    const result = dataSource.getFeatures({
      attributeValues: {
        textFeatures: {
          id: 123,
          value: 'something^something else|another thing^that thing is cool',
        },
      },
    });
    expect(result).toMatchSnapshot();
    expect(createTextFeature.mock.calls).toMatchSnapshot();
  });

  it('returns scripture features when a contentItem has a ScriptureFeatures field', async () => {
    const dataSource = new ContentItemsDataSource();
    const createScriptureFeature = jest.fn(() => ({
      id: 'ScriptureFeature:123',
      body: 'something',
    }));
    dataSource.context = {
      dataSources: { Features: { createScriptureFeature } },
    };
    const result = dataSource.getFeatures({
      attributeValues: {
        scriptureFeatures: {
          id: 123,
          value: 'something^John 3:16|another thing^Mark 1:1',
        },
      },
    });
    expect(result).toMatchSnapshot();
    expect(createScriptureFeature.mock.calls).toMatchSnapshot();
  });

  it('returns scripture features with translation when a contentItem has a Features field', async () => {
    const dataSource = new ContentItemsDataSource();
    const createScriptureFeature = jest.fn(() => ({
      id: 'ScriptureFeature:123',
      body: 'something',
    }));
    dataSource.context = {
      dataSources: { Features: { createScriptureFeature } },
    };
    const result = dataSource.getFeatures({
      attributeValues: {
        features: {
          id: 123,
          value: 'scripture/esv^John 3:16|scripture^Mark 1:1',
        },
      },
    });
    expect(result).toMatchSnapshot('result mock');
    expect(createScriptureFeature.mock.calls).toMatchSnapshot(
      'createScriptureFeature mock'
    );
  });

  it('returns text features and when a contentItem has a TextFeatures and a TextFeature field', async () => {
    const dataSource = new ContentItemsDataSource();
    const createTextFeature = jest.fn(() => ({
      id: 'TextFeature:123',
      body: 'something',
    }));
    dataSource.context = { dataSources: { Features: { createTextFeature } } };
    const result = dataSource.getFeatures({
      attributeValues: {
        textFeatures: {
          id: 123,
          value: 'something^something else|another thing^that thing is cool',
        },
        textFeature: {
          id: 456,
          value: 'wow this is neat!',
        },
      },
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
    dataSource.byContentChannelId = jest.fn(() => ({
      andFilter: async () => Promise.resolve(),
    }));

    const result = dataSource.getSermonFeed({ id: '1' });
    expect(dataSource.byContentChannelId.mock.calls).toMatchSnapshot();
    expect(result).toMatchSnapshot();
  });

  it('getPersonaFeed fetches items from the custom rock endpoint', async () => {
    const dataSource = new ContentItemsDataSource();

    const personaMock = jest.fn(() => Promise.resolve(['123', '456']));
    dataSource.context = {
      dataSources: {
        Person: {
          getPersonas: personaMock,
        },
      },
    };

    dataSource.get = jest.fn(() => Promise.resolve());

    const query = await dataSource.byPersonaFeed();
    await query.get();

    expect(personaMock.mock.calls).toMatchSnapshot();
    expect(dataSource.get.mock.calls).toMatchSnapshot();
  });

  it('returns active livestream content when the LiveStream is live and there is a sermon', async () => {
    const dataSource = new ContentItemsDataSource();
    dataSource.context = {
      dataSources: {
        LiveStream: {
          getLiveStream: () => ({
            isLive: true,
          }),
        },
      },
    };

    dataSource.getSermonFeed = jest.fn(() => ({
      first: async () => Promise.resolve([{ id: '1' }]),
    }));

    const result = await dataSource.getActiveLiveStreamContent();

    expect(result).toMatchSnapshot();
    expect(dataSource.getSermonFeed.mock.calls).toMatchSnapshot();
  });

  it("returns an empty array LiveStream isn't live and there is a sermon", async () => {
    const dataSource = new ContentItemsDataSource();
    dataSource.context = {
      dataSources: {
        LiveStream: {
          getLiveStream: () => ({
            isLive: false,
          }),
        },
      },
    };

    dataSource.getSermonFeed = jest.fn(() => ({
      first: async () => Promise.resolve([{ id: '1' }]),
    }));

    const result = await dataSource.getActiveLiveStreamContent();

    expect(result).toMatchSnapshot();
    expect(dataSource.getSermonFeed.mock.calls).toMatchSnapshot();
  });

  it("getPersonaFeed doesn't fetch if there aren't any persona ids", async () => {
    const dataSource = new ContentItemsDataSource();

    const personaMock = jest.fn(() => Promise.resolve([]));
    dataSource.context = {
      dataSources: {
        Person: {
          getPersonas: personaMock,
        },
      },
    };

    dataSource.get = jest.fn(() => Promise.resolve());

    const query = await dataSource.byPersonaFeed();
    await query.get();

    expect(personaMock.mock.calls).toMatchSnapshot();
    expect(dataSource.get.mock.calls).toMatchSnapshot();
  });

  it('getPersonaFeed fetches items from the Apollos plugin', async () => {
    ApollosConfig.loadJs({
      ROCK: {
        USE_PLUGIN: true,
      },
    });
    const dataSource = new ContentItemsDataSource();

    const personaMock = jest.fn(() => Promise.resolve(['123', '456']));
    dataSource.context = {
      dataSources: {
        Person: {
          getPersonas: personaMock,
        },
      },
    };

    dataSource.get = jest.fn(() => Promise.resolve());

    const query = await dataSource.byPersonaFeed();
    await query.get();

    expect(personaMock.mock.calls).toMatchSnapshot();
    expect(dataSource.get.mock.calls).toMatchSnapshot();
  });

  it('returns null when there are no parent content items with images', async () => {
    const dataSource = new ContentItemsDataSource();
    dataSource.getCursorByChildContentItemId = () => ({
      get: () => Promise.resolve([{ attributeValues: {}, attributes: {} }]),
    });

    dataSource.context = {
      dataSources: {
        Cache: { get: () => Promise.resolve(null) },
      },
    };

    const image = await dataSource.getCoverImage({
      attributeValues: {},
      attributes: {},
    });

    expect(image).toBe(null);
  });

  it('stores cover image in the cache, when it exists', async () => {
    const dataSource = new ContentItemsDataSource();

    const setMock = jest.fn();
    dataSource.context = {
      dataSources: {
        Cache: { get: () => Promise.resolve(null), set: setMock },
      },
    };

    const image = await dataSource.getCoverImage({
      id: 123,
      attributeValues: {
        image: {
          attributeId: 1266,
          entityId: 1,
          value: 'https://some-domain.com/some/path/to/image.jpg',
        },
      },
      attributes: {
        image: {
          fieldTypeId: 10,
          entityTypeId: 208,
          key: 'Image',
          name: 'Image',
          attributeValues: {},
          id: 1266,
          guid: 'ffdf621c-ecff-4199-ab90-d678c36dce38',
        },
      },
    });

    expect(image).toMatchSnapshot();
    expect(setMock.mock.calls).toMatchSnapshot();
  });

  it('gets cover image from the cache, when it exists', async () => {
    const dataSource = new ContentItemsDataSource();

    const getMock = jest.fn(() =>
      Promise.resolve({
        __typename: 'ImageMedia',
        key: 'image',
        name: 'Image',
        sources: [{ uri: 'https://some-domain.com/some/path/to/image.jpg' }],
      })
    );
    dataSource.context = {
      dataSources: {
        Cache: { get: getMock },
      },
    };

    const image = await dataSource.getCoverImage({
      id: 123,
      attributeValues: {
        image: {
          attributeId: 1266,
          entityId: 1,
          value: 'https://some-domain.com/some/path/to/image.jpg',
        },
      },
      attributes: {
        image: {
          fieldTypeId: 10,
          entityTypeId: 208,
          key: 'Image',
          name: 'Image',
          attributeValues: {},
          id: 1266,
          guid: 'ffdf621c-ecff-4199-ab90-d678c36dce38',
        },
      },
    });

    expect(image).toMatchSnapshot('Image result');
    expect(getMock.mock.calls).toMatchSnapshot('Get mock calls');
  });
});
