const ApolloServer = require.requireActual('@apollosproject/config').default;

ApolloServer.loadJs({
  ROCK_MAPPINGS: {
    CONTENT_ITEM: {
      ContentSeriesContentItem: {
        EntityType: 'ContentChannelItem',
      },
      DevotionalContentItem: {
        EntityType: 'ContentChannelItem',
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
  },
});

export default ApolloServer;
