export default {
  Query: {
    scripture: (root, { query }, { dataSources }) =>
      dataSources.Scripture.getScripture(query),
  },
  ESVScripture: {
    query: ({ query }) => query,
    html: ({ passages }) => passages[0],
  },
};
