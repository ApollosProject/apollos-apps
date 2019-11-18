const ApolloServer = require.requireActual('@apollosproject/config').default;

ApolloServer.loadJs({
  ROCK: {
    TIMEZONE: 'America/New_York',
  },
});

export default ApolloServer;
