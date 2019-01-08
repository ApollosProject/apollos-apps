const ApolloServer = require.requireActual('@apollosproject/config').default;

ApolloServer.loadJs({
  ONE_SIGNAL: {
    APP_ID: 'some-app-id',
  },
});

export default ApolloServer;
