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
      WeekendContentItem: {
        EntityType: 'ContentChannelItem',
      },
      ContentItem: {
        EntityType: 'ContentChannelItem',
      },
    },
    DATAVIEW_CATEGORIES: {
      PersonaId: 123,
    },
    HOME_FEATURE_CHANNEL_ID: 13,
  },
  ROCK: {
    TIMEZONE: 'America/New_York',
    API_URL: 'https://apollosrock.newspring.cc/api',
    API_TOKEN: 'some-rock-token',
    IMAGE_URL: 'https://apollosrock.newspring.cc/GetImage.ashx',
    USE_AGENT: false,
  },
  HOME_FEATURES: [
    {
      algorithms: ['SERMON_CHILDREN', 'PERSONA_FEED'],
      subtitle: 'Explore what God calls you to today',
      title: 'FOR YOU',
    },
    {
      subtitle: "What's happening at apollos?",
      algorithms: [
        {
          type: 'CONTENT_CHANNEL',
          arguments: {
            contentChannelId: 13,
          },
        },
      ],
      title: 'BULLETIN',
    },
  ],
});

export default ApolloServer;
