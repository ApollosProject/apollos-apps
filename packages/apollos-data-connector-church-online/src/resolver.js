export default {
  Query: {
    liveStream: (root, args, { dataSources }) =>
      dataSources.LiveStream.getLiveStream(),
    liveStreams: (root, args, { dataSources }) =>
      dataSources.LiveStream.getLiveStreams(),
  },
  LiveStream: {
    contentItem: async (root, args, { dataSources }) => {
      if (root.contentItem) {
        return root.contentItem;
      }
      const sermonCursor = await dataSources.ContentItem.getSermonFeedAsync();
      return sermonCursor.first();
    },
  },
};
