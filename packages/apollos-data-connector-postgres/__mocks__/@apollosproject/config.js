const ApolloServer = require.requireActual('@apollosproject/config').default;

ApolloServer.loadJs({
  APP: {
    DEEP_LINK_HOST: 'apolloschurchapp',
  },
});

export default ApolloServer;
