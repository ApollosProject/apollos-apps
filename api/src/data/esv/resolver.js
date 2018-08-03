export default {
  Query: {
    scripture: (root, { query }, { dataSources }) =>
      dataSources.scripture.getScripture(query),
  },
};
