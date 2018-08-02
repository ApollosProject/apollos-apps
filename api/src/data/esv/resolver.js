export default {
  Query: {
    scripture: (root, { query }, { dataSources }) =>
      dataSources.scripture.get(query),
  },
  ESVScripture: {
    html: (data) => data,
  },
};
