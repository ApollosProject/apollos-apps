const ApolloServer = require.requireActual('@apollosproject/config').default;

ApolloServer.loadJs({
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
      ContentItem: {
        EntityType: 'ContentChannelItem',
      },
    },
    DATAVIEW_CATEGORIES: {
      PersonaId: 123,
    },
  },
  ROCK: {
    TIMEZONE: 'America/New_York',
    API_URL: 'https://apollosrock.newspring.cc/api',
    API_TOKEN: 'some-rock-token',
    IMAGE_URL: 'https://apollosrock.newspring.cc/GetImage.ashx',
  },
});

export default ApolloServer;
