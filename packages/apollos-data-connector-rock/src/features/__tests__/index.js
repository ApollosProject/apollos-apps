import ApollosConfig from '@apollosproject/config';
import { parseGlobalId } from '@apollosproject/server-core';

import Feature from '../data-source';
import resolver from '../resolver';

const expandResult = async (result) => {
  let expandedResult = { ...result };
  if (result.cards && typeof result.cards === 'function') {
    expandedResult = { ...expandedResult, cards: await result.cards() };
  }
  if (result.actions && typeof result.actions === 'function') {
    expandedResult = { ...expandedResult, actions: await result.actions() };
  }
  if (result.heroCard && typeof result.heroCard === 'function') {
    expandedResult = { ...expandedResult, heroCard: await result.heroCard() };
  }

  return expandedResult;
};

const itemMock = [
  {
    id: 1,
    title: 'first item by content channel id',
    contentChannel: { name: 'content channel' },
  },
  {
    id: 2,
    title: 'second item by content channel id',
    contentChannel: { name: 'content channel' },
  },
  {
    id: 3,
    title: 'third item by content channel id',
    contentChannel: null,
  },
];

let first;
let context;

describe('features', () => {
  beforeEach(() => {
    const byPersonaFeed = jest.fn(() => ({
      expand: () => ({
        get: () => [
          {
            id: 1,
            title: 'first item',
            contentChannel: { name: 'content channel' },
          },
          {
            id: 2,
            title: 'second item',
            contentChannel: { name: 'content channel' },
          },
          {
            id: 3,
            title: 'third item',
            contentChannel: { name: 'content channel' },
          },
        ],
      }),
    }));
    first = jest.fn(() => Promise.resolve(itemMock));
    const byContentChannelId = () => ({
      expand: () => ({
        get: () => Promise.resolve(itemMock),
        top: () => ({ get: () => Promise.resolve(itemMock) }),
      }),
      first,
    });
    const getCursorByParentContentItemId = () => ({
      expand: () => ({
        get: () => Promise.resolve(itemMock),
      }),
      top: () => ({
        get: () => Promise.resolve(itemMock),
        expand: () => ({
          get: () => Promise.resolve(itemMock),
        }),
      }),
      first,
    });
    const getSeriesWithUserProgress = () => ({
      expand: () => ({
        top: () => ({
          get: () => Promise.resolve(itemMock),
        }),
      }),
    });
    const byContentChannelIds = () => ({
      get: () => Promise.resolve([{ id: 123, title: 'Featured Things' }]),
    });
    const getSermonFeed = () => ({
      first,
    });
    const byUserFeed = () => ({
      top: () => ({ get: () => Promise.resolve(itemMock) }),
    });
    context = {
      dataSources: {
        ContentItem: {
          byPersonaFeed,
          byContentChannelIds,
          byContentChannelId,
          byUserFeed,
          getCursorByParentContentItemId,
          getSermonFeed,
          getSeriesWithUserProgress,
          getCoverImage: () => null,
          resolveType: () => 'UniversalContentItem',
          createSummary: () => 'summary data',
        },
        Scripture: {},
        Event: {
          findRecent: () => ({
            top: () => ({
              get: () =>
                Promise.resolve([
                  {
                    id: '123',
                    eventItemId: '456',
                    schedule: {
                      effectiveStartDate: '2019-09-16T21:41:45.686Z',
                    },
                  },
                ]),
            }),
          }),
          getName: () => Promise.resolve('Some Event'),
          getImage: () => Promise.resolve([{ uri: 'http://url.com' }]),
          getDateTime: () =>
            Promise.resolve({
              start: '2019-09-16T21:41:45.686Z',
              end: '2019-09-16T21:41:45.686Z',
            }),
        },
      },
    };
  });
  describe('resolver', () => {
    it('must return a personaFeed, a sermonChildrenFeed, and a contentChannelFeed for the userFeedFeatures', async () => {
      const feature = new Feature();
      feature.initialize({
        context,
      });
      const result = await resolver.Query.userFeedFeatures(null, null, {
        dataSources: { Feature: feature },
      });
      expect(await Promise.all(result.map(expandResult))).toMatchSnapshot();
    });
  });
  describe('dataSource', () => {
    it('should create an ActionListFeature from a PERSONA_FEED', async () => {
      const feature = new Feature();
      feature.initialize({
        context,
      });

      const result = await feature.createActionListFeature({
        algorithms: ['PERSONA_FEED'],
        title: 'Test Action List',
        subtitle: "It's great!",
      });

      expect(await expandResult(result)).toMatchSnapshot();
    });

    it('should create an VerticalCardListFeature from a PERSONA_FEED', async () => {
      const feature = new Feature();
      feature.initialize({
        context,
      });

      const result = await feature.createVerticalCardListFeature({
        algorithms: ['PERSONA_FEED'],
        title: 'Test Action List',
        subtitle: "It's great!",
      });

      expect(await expandResult(result)).toMatchSnapshot();
    });

    it('should create an HorizontalCardListFeature from a PERSONA_FEED', async () => {
      const feature = new Feature();
      feature.initialize({
        context,
      });

      const result = await feature.createHorizontalCardListFeature({
        algorithms: ['PERSONA_FEED'],
        title: 'Test Horizontal List of Cards',
        subtitle: 'Boom',
      });

      expect(await expandResult(result)).toMatchSnapshot();
    });

    it('should create an ActionListFeature from multiple PERSONA_FEED algorithms', async () => {
      const feature = new Feature();
      feature.initialize({
        context,
      });

      const result = await feature.createActionListFeature({
        algorithms: ['PERSONA_FEED', 'PERSONA_FEED'],
        title: 'Test Action List',
        subtitle: "It's great!",
      });

      expect(await expandResult(result)).toMatchSnapshot();
    });

    it('should create an ActionListFeature from a UPCOMING_EVENTS', async () => {
      const feature = new Feature();
      feature.initialize({
        context,
      });

      const result = await feature.createActionListFeature({
        algorithms: ['UPCOMING_EVENTS'],
        title: 'Test Action List',
        subtitle: "It's great!",
      });

      expect(await expandResult(result)).toMatchSnapshot();
    });

    it('should create an ActionListFeature from a CONTENT_CHANNEL algorithm', async () => {
      const feature = new Feature();
      feature.initialize({
        context,
      });

      const result = await feature.createActionListFeature({
        algorithms: [
          {
            type: 'CONTENT_CHANNEL',
            arguments: { contentChannelId: 13 },
          },
        ],
        title: 'Test Action List',
        subtitle: "It's great!",
      });

      expect(await expandResult(result)).toMatchSnapshot();
      expect(first.mock.calls).toMatchSnapshot();
    });
    it('should create an ActionListFeature from a CONTENT_CHANNEL algorithm with a primary action', async () => {
      const feature = new Feature();
      feature.initialize({
        context,
      });

      const result = await feature.createActionListFeature({
        algorithms: [
          {
            type: 'CONTENT_CHANNEL',
            arguments: { contentChannelId: 13 },
          },
        ],
        title: 'Test Action List',
        subtitle: "It's great!",

        primaryAction: {
          action: 'OPEN_URL',
          title: 'Open this url',
          relatedNode: {
            __typename: 'Url',
            url: 'https://www.google.com',
          },
        },
      });

      expect(await expandResult(result)).toMatchSnapshot();
      expect(first.mock.calls).toMatchSnapshot();
    });
    it('should create an ActionListFeature from a CONTENT_CHANNEL algorithm with a primary action with an id', async () => {
      const feature = new Feature();
      feature.initialize({
        context,
      });

      const result = await feature.createActionListFeature({
        algorithms: [
          {
            type: 'CONTENT_CHANNEL',
            arguments: { contentChannelId: 13 },
          },
        ],
        title: 'Test Action List',
        subtitle: "It's great!",

        primaryAction: {
          action: 'OPEN_URL',
          title: 'Open this url',
          relatedNode: {
            id: 'Url123',
            __typename: 'Url',
            url: 'https://www.google.com',
          },
        },
      });

      expect(await expandResult(result)).toMatchSnapshot();
      expect(first.mock.calls).toMatchSnapshot();
    });

    it('should create an ActionListFeature from a SERMON_CHILDREN algorithm', async () => {
      const feature = new Feature();
      feature.initialize({
        context,
      });

      const result = await feature.createActionListFeature({
        algorithms: ['SERMON_CHILDREN'],
        title: 'Test Action List',
        subtitle: "It's great!",
      });

      expect(await expandResult(result)).toMatchSnapshot();
      expect(first.mock.calls).toMatchSnapshot();
    });

    it('should create an ActionListFeature from a CONTENT_CHANNEL algorithm with limit', async () => {
      const feature = new Feature();
      feature.initialize({
        context,
      });

      const result = await feature.createActionListFeature({
        algorithms: [
          {
            type: 'CONTENT_CHANNEL',
            arguments: { contentChannelId: 13, limit: 1 },
          },
        ],
        title: 'Test Action List',
        subtitle: "It's great!",
      });

      expect(await expandResult(result)).toMatchSnapshot();
      expect(first.mock.calls).toMatchSnapshot();
    });

    it('should throw an error when creating a ActionListFeature from a CONTENT_CHANNEL with no contentChannelId', async () => {
      const feature = new Feature();
      feature.initialize({
        context,
      });

      const result = feature.createActionListFeature({
        algorithms: [
          {
            type: 'CONTENT_CHANNEL',
            arguments: {},
          },
        ],
        title: 'Test Action List',
        subtitle: "It's great!",
      });

      expect(result).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should create an ActionListFeature from no algorithms', async () => {
      const feature = new Feature();
      feature.initialize({
        context,
      });

      const result = await feature.createActionListFeature({
        algorithms: [],
        title: 'Test Action List',
        subtitle: "It's great!",
      });

      expect(await expandResult(result)).toMatchSnapshot();
    });

    it('should create an ActionListFeature from two different algorithms', async () => {
      const feature = new Feature();
      feature.initialize({
        context,
      });

      const result = await feature.createActionListFeature({
        algorithms: [
          {
            type: 'CONTENT_CHANNEL',
            arguments: { contentChannelId: 13 },
          },
          'PERSONA_FEED',
        ],
        title: 'Test Action List',
        subtitle: "It's great!",
      });

      expect(await expandResult(result)).toMatchSnapshot();
    });

    it('should create a PrayerListFeature from a DAILY_PRAYER algorithm', async () => {
      const feature = new Feature();
      feature.initialize({
        context,
      });

      const result = await feature.createPrayerListFeature({
        algorithms: [
          {
            type: 'DAILY_PRAYER',
          },
        ],
        title: 'Test Action List',
        subtitle: "It's great!",
      });

      expect(await expandResult(result)).toMatchSnapshot();
      expect(first.mock.calls).toMatchSnapshot();
    });

    it('createTextFeature should create a Text feature', async () => {
      const feature = new Feature();
      feature.initialize({
        context,
      });

      const result = await feature.createTextFeature({
        text: 'Hello World',
        id: 123,
      });

      expect(result).toMatchSnapshot();
    });

    it('createScriptureFeature should create a Scriptre feature', async () => {
      const feature = new Feature();
      feature.initialize({
        context,
      });

      const result = await feature.createScriptureFeature({
        reference: 'John 3:16',
        id: 123,
      });

      expect(result).toMatchSnapshot();
    });

    it('should generate scripture shares', async () => {
      const feature = new Feature();
      feature.initialize({
        context,
      });

      const { Scripture } = feature.context.dataSources;
      Scripture.getScriptures = jest.fn(() => [
        {
          reference: 'John 3:16',
          content: '<p>Not the real verse</p>',
        },
      ]);
      const result = await feature.getScriptureShareMessage([
        {
          reference: 'John 3:16',
        },
      ]);

      expect(result).toMatchSnapshot();
    });

    it('should create an ActionListFeature from a CAMPAIGN_ITEMS algorithm', async () => {
      const feature = new Feature();
      feature.initialize({
        context,
      });

      const result = await feature.createActionListFeature({
        algorithms: [
          {
            type: 'CAMPAIGN_ITEMS',
          },
        ],
        title: 'Test Featured Item',
        subtitle: "It's featured!",
      });

      expect(await expandResult(result)).toMatchSnapshot();
      expect(first.mock.calls).toMatchSnapshot();
    });

    it('should create an ActionListFeature from a USER_FEED algorithm', async () => {
      const feature = new Feature();
      feature.initialize({
        context,
      });

      const result = await feature.createActionListFeature({
        algorithms: [
          {
            type: 'USER_FEED',
          },
        ],
        title: 'Test Featured Item',
        subtitle: "It's featured!",
      });

      expect(await expandResult(result)).toMatchSnapshot();
      expect(first.mock.calls).toMatchSnapshot();
    });

    it('should create an ActionListFeature from a SERIES_IN_PROGRESS algorithm', async () => {
      const feature = new Feature();
      feature.initialize({
        context,
      });

      const result = await feature.createActionListFeature({
        algorithms: [
          {
            type: 'SERIES_IN_PROGRESS',
          },
        ],
        title: 'Test Featured Item',
        subtitle: "It's featured!",
      });

      expect(await expandResult(result)).toMatchSnapshot();
    });
    it('should create an HeroListFeature from a USER_FEED algorithm', async () => {
      const feature = new Feature();
      feature.initialize({
        context,
      });

      const result = await feature.createHeroListFeature({
        algorithms: [
          {
            type: 'USER_FEED',
          },
        ],
        title: 'Test HeroListFeature',
        subtitle: "It's a hero list feature!",
      });

      expect(await expandResult(result)).toMatchSnapshot();
    });
    it('should create an HeroListFeature from a USER_FEED algorithm and a primary action', async () => {
      const feature = new Feature();
      feature.initialize({
        context,
      });

      const result = await feature.createHeroListFeature({
        algorithms: [
          {
            type: 'USER_FEED',
          },
        ],
        title: 'Test HeroListFeature',
        subtitle: "It's a hero list feature!",
        primaryAction: {
          action: 'OPEN_URL',
          title: 'Open this url',
          relatedNode: {
            __typename: 'Url',
            url: 'https://www.google.com',
          },
        },
      });

      expect(await expandResult(result)).toMatchSnapshot();
    });
    it('should create an HeroListFeature from a USER_FEED algorithm and a primary action with an id', async () => {
      const feature = new Feature();
      feature.initialize({
        context,
      });

      const result = await feature.createHeroListFeature({
        algorithms: [
          {
            type: 'USER_FEED',
          },
        ],
        title: 'Test HeroListFeature',
        subtitle: "It's a hero list feature!",
        primaryAction: {
          action: 'OPEN_URL',
          title: 'Open this url',
          relatedNode: {
            __typename: 'Url',
            id: 'Url:123',
            url: 'https://www.google.com',
          },
        },
      });

      expect(await expandResult(result)).toMatchSnapshot();
    });
    it('should create an HeroListFeature from a feed algorithm and a different hero algorithm ', async () => {
      const feature = new Feature();
      feature.initialize({
        context,
      });

      const result = await feature.createHeroListFeature({
        algorithms: [
          {
            type: 'USER_FEED',
          },
        ],
        heroAlgorithms: [
          {
            type: 'PERSONA_FEED',
          },
        ],
        title: 'Test HeroListFeature',
        subtitle: "It's a hero list feature!",
      });

      expect(await expandResult(result)).toMatchSnapshot();
    });
    it('should render the default case from getHomeFeedFeatures', async () => {
      const feature = new Feature();
      feature.initialize({
        context,
      });

      ApollosConfig.loadJs({
        HOME_FEATURES: [
          {
            algorithms: ['PERSONA_FEED'],
            subtitle: 'Explore what God calls you to today',
            title: 'FOR YOU',
          },
        ],
      });

      const result = await feature.getHomeFeedFeatures();

      expect(await Promise.all(result.map(expandResult))).toMatchSnapshot();
    });
    it('should render the VerticalCardList type from getHomeFeedFeatures', async () => {
      const feature = new Feature();
      feature.initialize({
        context,
      });

      ApollosConfig.loadJs({
        HOME_FEATURES: [
          {
            algorithms: ['PERSONA_FEED'],
            subtitle: 'Explore what God calls you to today',
            title: 'FOR YOU',
            type: 'VerticalCardList',
          },
        ],
      });

      const result = await feature.getHomeFeedFeatures();

      expect(await Promise.all(result.map(expandResult))).toMatchSnapshot();
    });
    it('should render the HorizontalCardList type from getHomeFeedFeatures', async () => {
      const feature = new Feature();
      feature.initialize({
        context,
      });

      ApollosConfig.loadJs({
        HOME_FEATURES: [
          {
            algorithms: ['PERSONA_FEED'],
            subtitle: 'Explore what God calls you to today',
            title: 'FOR YOU',
            type: 'HorizontalCardList',
          },
        ],
      });

      const result = await feature.getHomeFeedFeatures();

      expect(await Promise.all(result.map(expandResult))).toMatchSnapshot();
    });

    it('should render the HeroListFeature type from getHomeFeedFeatures', async () => {
      const feature = new Feature();
      feature.initialize({
        context,
      });

      ApollosConfig.loadJs({
        HOME_FEATURES: [
          {
            algorithms: ['PERSONA_FEED'],
            subtitle: 'Explore what God calls you to today',
            title: 'FOR YOU',
            type: 'HeroListFeature',
          },
        ],
      });

      const result = await feature.getHomeFeedFeatures();

      expect(await Promise.all(result.map(expandResult))).toMatchSnapshot();
    });

    it("should recontruct a feature from it's id", async () => {
      const feature = new Feature();
      feature.initialize({
        context,
      });

      const builtFeature = await feature.createActionListFeature({
        algorithms: [
          {
            type: 'CAMPAIGN_ITEMS',
          },
        ],
        title: 'Test Featured Item',
        subtitle: "It's featured!",
      });

      const { id } = parseGlobalId(builtFeature.id);
      const result = await feature.getFromId(id, builtFeature.id);

      expect(await expandResult(result)).toMatchSnapshot();
    });

    it('should lazy load running of attached algoritms', async () => {
      const feature = new Feature();
      feature.initialize({
        context,
      });

      const result = await feature.createActionListFeature({
        algorithms: [
          {
            type: 'CAMPAIGN_ITEMS',
          },
        ],
        title: 'Test Featured Item',
        subtitle: "It's featured!",
      });

      expect(result).toMatchSnapshot('default (cards not loaded)');
      expect(await expandResult(result)).toMatchSnapshot('with cards loaded');
    });
  });
});
