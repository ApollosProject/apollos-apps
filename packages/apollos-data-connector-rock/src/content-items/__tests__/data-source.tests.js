import { fetch } from 'apollo-server-env';
import ApollosConfig from '@apollosproject/config';
import { createGlobalId } from '@apollosproject/server-core';
import { AuthenticationError } from 'apollo-server';
import { buildGetMock } from '../../test-utils';
import ContentItemsDataSource from '../data-source';

ApollosConfig.loadJs({
  APP: {
    UNIVERSAL_LINK_HOST: 'https://apollos.api',
  },
  ROCK: {
    API_URL: 'https://apollosrock.newspring.cc/api',
    API_TOKEN: 'some-rock-token',
    IMAGE_URL: 'https://apollosrock.newspring.cc/GetImage.ashx',
    TIMEZONE: 'America/New_York',
    USE_PLUGIN: true,
  },
  ROCK_MAPPINGS: {
    SERMON_CHANNEL_ID: 'TEST_ID',
    CAMPAIGN_CHANNEL_IDS: [1],
  },
  BIBLE_API: {
    BIBLE_ID: {
      ESV: 'some-bible-id',
    },
  },
});

const RealDate = Date;

function mockDate(isoDate) {
  global.Date = class extends (
    RealDate
  ) {
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

  it('creates a sharing URL', async () => {
    const dataSource = new ContentItemsDataSource();
    dataSource.resolveType = () => 'WeekendContentItem';
    const url = await dataSource.getShareUrl({ content: { id: 1 } });
    expect(url).toMatchSnapshot();
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
      dataSources: {
        Feature: {
          createTextFeature,
          createScriptureFeature,
        },
      },
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

  it('returns comment features when a contentItem has a Comments field set to true', async () => {
    const dataSource = new ContentItemsDataSource();
    const createCommentListFeature = jest.fn(() => ({
      id: 'CommentListFeature:123',
      comments: [],
      __typename: 'CommentListFeature',
    }));
    const createAddCommentFeature = jest.fn(() => ({
      id: 'AddCommentFeature:123',
      initialPrompt: 'Write Something...',
      addPrompt: 'What stands out to you?',
      __typename: 'AddCommentFeature',
    }));
    dataSource.context = {
      dataSources: {
        Feature: {
          createCommentListFeature,
          createAddCommentFeature,
        },
      },
    };
    const result = dataSource.getFeatures({
      attributeValues: {
        comments: {
          id: 123,
          value: 'True',
        },
      },
      attributes: {},
      id: 'ContentItem:123Test',
    });
    expect(result).toMatchSnapshot();
    expect(createCommentListFeature.mock.calls).toMatchSnapshot();
    expect(createAddCommentFeature.mock.calls).toMatchSnapshot();
  });

  it('returns a text feature when a contentItem has a TextFeature field', async () => {
    const dataSource = new ContentItemsDataSource();
    const createTextFeature = jest.fn(() => ({
      id: 'TextFeature:123',
      body: 'something',
    }));
    dataSource.context = { dataSources: { Feature: { createTextFeature } } };
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
    dataSource.context = { dataSources: { Feature: { createTextFeature } } };
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
      dataSources: { Feature: { createScriptureFeature } },
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
      dataSources: { Feature: { createScriptureFeature } },
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
    dataSource.context = { dataSources: { Feature: { createTextFeature } } };
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
    dataSource.context = { dataSources: { Feature: { createTextFeature } } };
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
        Persona: {
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
        Persona: {
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
        Persona: {
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
  it('gets the next item for a content series, based on past interactions', async () => {
    const dataSource = new ContentItemsDataSource();
    dataSource.get = jest.fn(() =>
      Promise.resolve([{ id: 1 }, { id: 2 }, { id: 3 }])
    );
    dataSource.context = {
      dataSources: {
        Auth: { getCurrentPerson: () => ({ id: '1' }) },
        Interactions: {
          getInteractionsForCurrentUserAndNodes: jest.fn(() =>
            Promise.resolve([
              { foreignKey: createGlobalId(1, 'UniversalContentItem') },
              { foreignKey: createGlobalId(2, 'UniversalContentItem') },
              { foreignKey: createGlobalId(3, 'UniversalContentItem') },
            ])
          ),
        },
      },
    };
    dataSource.resolveType = () => 'UniversalContentItem';

    const result = await dataSource.getUpNext({ id: 'parent-channel-1' });

    expect(result).toEqual(null);
    expect(dataSource.get).toMatchSnapshot();
    expect(
      dataSource.context.dataSources.Interactions
        .getInteractionsForCurrentUserAndNodes
    ).toMatchSnapshot();
  });
  it('gets the next item for a content series, based on different past interactions', async () => {
    const dataSource = new ContentItemsDataSource();
    dataSource.get = jest.fn(() =>
      Promise.resolve([{ id: 1 }, { id: 2 }, { id: 3 }])
    );
    dataSource.context = {
      dataSources: {
        Auth: { getCurrentPerson: () => ({ id: '1' }) },
        Interactions: {
          getInteractionsForCurrentUserAndNodes: jest.fn(() =>
            Promise.resolve([
              { foreignKey: createGlobalId(1, 'UniversalContentItem') },
            ])
          ),
        },
      },
    };
    dataSource.resolveType = () => 'UniversalContentItem';

    const result = await dataSource.getUpNext({ id: 'parent-channel-1' });

    expect(result).toEqual({
      id: 2,
      apollosId: createGlobalId(2, 'UniversalContentItem'),
    });
    expect(dataSource.get).toMatchSnapshot();
    expect(
      dataSource.context.dataSources.Interactions
        .getInteractionsForCurrentUserAndNodes
    ).toMatchSnapshot();
  });
  it('returns null when getting the next item based on past interactions without a user', async () => {
    const dataSource = new ContentItemsDataSource();
    dataSource.get = jest.fn(() =>
      Promise.resolve([{ id: 1 }, { id: 2 }, { id: 3 }])
    );
    dataSource.context = {
      dataSources: {
        Auth: {
          getCurrentPerson: () => {
            throw new AuthenticationError();
          },
        },
        Interactions: {
          getInteractionsForCurrentUserAndNodes: jest.fn(() =>
            Promise.resolve([
              { foreignKey: createGlobalId(1, 'UniversalContentItem') },
            ])
          ),
        },
      },
    };
    dataSource.resolveType = () => 'UniversalContentItem';

    const result = await dataSource.getUpNext({ id: 'parent-channel-1' });

    expect(result).toEqual(null);
    expect(dataSource.get).toMatchSnapshot();
    expect(
      dataSource.context.dataSources.Interactions
        .getInteractionsForCurrentUserAndNodes
    ).toMatchSnapshot();
  });

  it('gets a percentage for a content series, based on past interactions', async () => {
    const dataSource = new ContentItemsDataSource();
    dataSource.get = jest.fn(() =>
      Promise.resolve([{ id: 3 }, { id: 2 }, { id: 1 }])
    );
    dataSource.context = {
      dataSources: {
        Auth: { getCurrentPerson: () => ({ id: '1' }) },
        Interactions: {
          getInteractionsForCurrentUserAndNodes: jest.fn(() =>
            Promise.resolve([
              { foreignKey: createGlobalId(1, 'UniversalContentItem') },
              { foreignKey: createGlobalId(2, 'UniversalContentItem') },
            ])
          ),
        },
      },
    };
    dataSource.resolveType = () => 'UniversalContentItem';

    const result = await dataSource.getPercentComplete({
      id: 'parent-channel-1',
    });

    const twoThirdsPercent = (2 / 3) * 100;
    expect(result).toEqual(twoThirdsPercent);
    expect(dataSource.get).toMatchSnapshot();
    expect(
      dataSource.context.dataSources.Interactions
        .getInteractionsForCurrentUserAndNodes
    ).toMatchSnapshot();
  });
  it('gets a percentage for a content series, based on different past interactions', async () => {
    const dataSource = new ContentItemsDataSource();
    dataSource.get = jest.fn(() =>
      Promise.resolve([{ id: 3 }, { id: 2 }, { id: 1 }])
    );
    dataSource.context = {
      dataSources: {
        Auth: { getCurrentPerson: () => ({ id: '1' }) },
        Interactions: {
          getInteractionsForCurrentUserAndNodes: jest.fn(() =>
            Promise.resolve([])
          ),
        },
      },
    };
    dataSource.resolveType = () => 'UniversalContentItem';

    const result = await dataSource.getPercentComplete({
      id: 'parent-channel-1',
    });

    expect(result).toEqual(0.0);
    expect(dataSource.get).toMatchSnapshot();
    expect(
      dataSource.context.dataSources.Interactions
        .getInteractionsForCurrentUserAndNodes
    ).toMatchSnapshot();
  });

  it('gets a percentage for a content series, even if a series has no children', async () => {
    const dataSource = new ContentItemsDataSource();
    dataSource.get = jest.fn(() => Promise.resolve([]));
    dataSource.context = {
      dataSources: {
        Auth: { getCurrentPerson: () => ({ id: '1' }) },
        Interactions: {
          getInteractionsForCurrentUserAndNodes: jest.fn(() =>
            Promise.resolve([])
          ),
        },
      },
    };
    dataSource.resolveType = () => 'UniversalContentItem';

    const result = await dataSource.getPercentComplete({
      id: 'parent-channel-1',
    });

    expect(result).toEqual(0);
    expect(dataSource.get).toMatchSnapshot();
    expect(
      dataSource.context.dataSources.Interactions
        .getInteractionsForCurrentUserAndNodes
    ).toMatchSnapshot();
  });

  it('returns null when getting a percentage for a content series without a user', async () => {
    const dataSource = new ContentItemsDataSource();
    dataSource.get = jest.fn(() =>
      Promise.resolve([{ id: 3 }, { id: 2 }, { id: 1 }])
    );
    dataSource.context = {
      dataSources: {
        Auth: {
          getCurrentPerson: () => {
            throw new AuthenticationError();
          },
        },
        Interactions: {
          getInteractionsForCurrentUserAndNodes: jest.fn(() =>
            Promise.resolve([])
          ),
        },
      },
    };
    dataSource.resolveType = () => 'UniversalContentItem';

    const result = await dataSource.getPercentComplete({
      id: 'parent-channel-1',
    });

    expect(result).toEqual(null);
    expect(dataSource.get).toMatchSnapshot();
    expect(
      dataSource.context.dataSources.Interactions
        .getInteractionsForCurrentUserAndNodes
    ).toMatchSnapshot();
  });
  it('gets series a user has viewed', async () => {
    const dataSource = new ContentItemsDataSource();
    dataSource.get = jest.fn(() => Promise.resolve([{ id: 3 }]));
    dataSource.getPercentComplete = jest.fn(({ id }) => (id === '1' ? 100 : 0));
    dataSource.getFromIds = jest.fn(() => ({ andFilter: () => null }));
    dataSource.context = {
      dataSources: {
        Auth: { getCurrentPerson: () => ({ id: '1' }) },
        Interactions: {
          getInteractionsForCurrentUser: jest.fn(() =>
            Promise.resolve([
              { foreignKey: createGlobalId('1', 'UniversalContentItem') },
              { foreignKey: createGlobalId('2', 'UniversalContentItem') },
              { foreignKey: createGlobalId('2', 'UniversalContentItem') },
              { foreignKey: createGlobalId('3', 'UniversalContentItem') },
            ])
          ),
        },
      },
    };

    await dataSource.getSeriesWithUserProgress();
    expect(dataSource.getFromIds.mock.calls).toMatchSnapshot('get from ids');
    expect(dataSource.getPercentComplete.mock.calls).toMatchSnapshot(
      'get percent complete'
    );
  });
  it('gets series from specific channel a user has viewed', async () => {
    const dataSource = new ContentItemsDataSource();
    dataSource.get = jest.fn(() => Promise.resolve([{ id: 3 }]));
    dataSource.getPercentComplete = jest.fn(({ id }) => (id === '1' ? 100 : 0));
    dataSource.getFromIds = jest.fn(() => ({
      andFilter: () => ({ andFilter: () => null }),
    }));
    dataSource.context = {
      dataSources: {
        Auth: { getCurrentPerson: () => ({ id: '1' }) },
        Interactions: {
          getInteractionsForCurrentUser: jest.fn(() =>
            Promise.resolve([
              { foreignKey: createGlobalId('1', 'UniversalContentItem') },
              { foreignKey: createGlobalId('2', 'UniversalContentItem') },
              { foreignKey: createGlobalId('2', 'UniversalContentItem') },
              { foreignKey: createGlobalId('3', 'UniversalContentItem') },
            ])
          ),
        },
      },
    };

    await dataSource.getSeriesWithUserProgress({ channelIds: [10] });
    expect(dataSource.getFromIds.mock.calls).toMatchSnapshot('get from ids');
    expect(dataSource.getPercentComplete.mock.calls).toMatchSnapshot(
      'get percent complete'
    );
  });
  it('gets an empty array fpr series a user has viewed without a user', async () => {
    const dataSource = new ContentItemsDataSource();
    dataSource.get = jest.fn(() => Promise.resolve([{ id: 3 }]));
    dataSource.getPercentComplete = jest.fn(({ id }) => (id === '1' ? 100 : 0));
    dataSource.getFromIds = jest.fn();
    dataSource.context = {
      dataSources: {
        getCurrentPerson: () => {
          throw new AuthenticationError();
        },
        Interactions: {
          getInteractionsForCurrentUser: jest.fn(() =>
            Promise.resolve([
              { foreignKey: createGlobalId('1', 'UniversalContentItem') },
              { foreignKey: createGlobalId('2', 'UniversalContentItem') },
              { foreignKey: createGlobalId('2', 'UniversalContentItem') },
              { foreignKey: createGlobalId('3', 'UniversalContentItem') },
            ])
          ),
        },
      },
    };

    const result = await dataSource.getSeriesWithUserProgress();
    expect(dataSource.getFromIds.mock.calls).toMatchSnapshot('get from ids');
    expect(dataSource.getPercentComplete.mock.calls).toMatchSnapshot(
      'get percent complete'
    );
    expect(await result.get()).toMatchSnapshot('result');
  });
  it('returns a hyphonated titled if any words are longer than 7 characters', async () => {
    const dataSource = new ContentItemsDataSource();
    const result = dataSource.createHyphenatedString({
      text:
        'Antidisestablishmentarianism is useful when center justifying a text.',
    });

    // This may look identical but it has a bunch of hidden `\u00AD` hyphens in it.
    expect(result).toEqual(
      'Antidises­tab­lish­men­tar­i­an­ism is useful when center justifying a text.'
    );
  });
});
