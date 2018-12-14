export default {
  Query: {
    scripture: (root, { query }, { dataSources }) =>
      dataSources.Scripture.getScripture(query),
    scriptures: (root, { query }, { dataSources }) =>
      dataSources.Scripture.getScriptures(query),
  },
  Scripture: {
    html: ({ content }) => content,
  },
};
