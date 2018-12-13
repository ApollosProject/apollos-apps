export default {
  Query: {
    scripture: (root, { query }, { dataSources }) =>
      dataSources.Scripture.getScripture(query),
  },
  Scripture: {
    html: ({ content }) => content,
  },
};
