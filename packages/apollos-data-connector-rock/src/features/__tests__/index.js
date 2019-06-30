import Features from '../data-source';
import resolver from '../resolver';

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
    }));
    first = jest.fn(() => ({ get: () => itemMock }));
    const byContentChannelId = () => ({
      get: () => itemMock,
      first,
    });
    context = {
      dataSources: {
        ContentItem: {
          byPersonaFeed,
          byContentChannelId,
          getCoverImage: () => null,
          resolveType: () => 'UniversalContentItem',
        },
      },
    };
  });
  describe('dataSource', () => {
    it('should create an ActionListFeature from a PERSONA_FEED', async () => {
      const features = new Features();
      features.initialize({
        context,
      });

      const result = await features.createActionListFeature({
        algorithms: ['PERSONA_FEED'],
        title: 'Test Action List',
        subtitle: "It's great!",
      });

      expect(result).toMatchSnapshot();
    });

    it('should create an ActionListFeature from multiple PERSONA_FEED algorithms', async () => {
      const features = new Features();
      features.initialize({
        context,
      });

      const result = await features.createActionListFeature({
        algorithms: ['PERSONA_FEED', 'PERSONA_FEED'],
        title: 'Test Action List',
        subtitle: "It's great!",
      });

      expect(result).toMatchSnapshot();
    });

    it('should create an ActionListFeature from a CONTENT_CHANNEL algorithm', async () => {
      const features = new Features();
      features.initialize({
        context,
      });

      const result = await features.createActionListFeature({
        algorithms: [
          {
            type: 'CONTENT_CHANNEL',
            arguments: { contentChannelId: 13 },
          },
        ],
        title: 'Test Action List',
        subtitle: "It's great!",
      });

      expect(result).toMatchSnapshot();
      expect(first.mock.calls).toMatchSnapshot();
    });

    it('should create an ActionListFeature from a CONTENT_CHANNEL algorithm with limit', async () => {
      const features = new Features();
      features.initialize({
        context,
      });

      const result = await features.createActionListFeature({
        algorithms: [
          {
            type: 'CONTENT_CHANNEL',
            arguments: { contentChannelId: 13, limit: 1 },
          },
        ],
        title: 'Test Action List',
        subtitle: "It's great!",
      });

      expect(result).toMatchSnapshot();
      expect(first.mock.calls).toMatchSnapshot();
    });

    it('should throw an error when creating a ActionListFeature from a CONTENT_CHANNEL with no contentChannelId', async () => {
      const features = new Features();
      features.initialize({
        context,
      });

      const result = features.createActionListFeature({
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
      const features = new Features();
      features.initialize({
        context,
      });

      const result = await features.createActionListFeature({
        algorithms: [],
        title: 'Test Action List',
        subtitle: "It's great!",
      });

      expect(result).toMatchSnapshot();
    });

    it('should create an ActionListFeature from two different algorithms', async () => {
      const features = new Features();
      features.initialize({
        context,
      });

      const result = await features.createActionListFeature({
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

      expect(result).toMatchSnapshot();
    });

    it('createTextFeature should create a Text feature', async () => {
      const features = new Features();
      features.initialize({
        context,
      });

      const result = await features.createTextFeature({
        text: 'Hello World',
        id: 123,
      });

      expect(result).toMatchSnapshot();
    });
  });

  describe('resolver', () => {
    it('must return a personaFeed and a contentChannelFeed for the userFeedFeatures', async () => {
      const features = new Features();
      features.initialize({
        context,
      });
      const result = await resolver.Query.userFeedFeatures(null, null, {
        dataSources: { Features: features },
      });
      expect(result).toMatchSnapshot();
    });
  });
});
