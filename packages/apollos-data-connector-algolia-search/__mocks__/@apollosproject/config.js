const ApolloServer = require.requireActual('@apollosproject/config').default;

ApolloServer.loadJs({
  ROCK: {
    TIMEZONE: 'America/New_York',
  },
  ALGOLIA: {
    APPLICATION_ID: 'some-application-id',
    API_KEY: 'some-api-key',
    CONFIGURATION: {},
  },
});

export default ApolloServer;
