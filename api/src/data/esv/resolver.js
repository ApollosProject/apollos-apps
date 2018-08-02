export default {
  Query: {
    scripture: (root, { query }, { dataSources }) =>
      dataSources.scripture.getScripture(query),
  },
  ESVScripture: {
    html: (data) => data,
  },
};
