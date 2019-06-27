import Features from '../data-source';
import resolver from '../resolver';

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
    context = {
      dataSources: {
        ContentItem: {
          byPersonaFeed,
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
  });

  describe('resolver', () => {
    it('must return a personaFeed for the userFeedFeatures', async () => {
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
