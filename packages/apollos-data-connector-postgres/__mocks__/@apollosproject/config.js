const ApollosConfig = require.requireActual('@apollosproject/config').default;

ApolloServer.loadJs({
  APP: {
    DEEP_LINK_HOST: 'apolloschurchapp',
  },
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
      WeekendContentItem: {
        EntityType: 'ContentChannelItem',
      },
      ContentItem: {
        EntityType: 'ContentChannelItem',
      },
    },
  },
});

export default ApollosConfig;
