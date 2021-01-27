const ApolloServer = require.requireActual('@apollosproject/config').default;

ApolloServer.loadJs({
  DATABASE: {
    URL: `sqlite:${process.env.PWD}/testing-${process.env.JEST_WORKER_ID}.db`,
  },
});

export default ApolloServer;
