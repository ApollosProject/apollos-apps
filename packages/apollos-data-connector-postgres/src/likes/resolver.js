const defaultContentItemResolvers = {
  likedCount: ({ apollosId }, args, { dataSources }) =>
    dataSources.Likes.getLikesCountByNodeId({
      nodeId: apollosId,
    }),

  isLiked: async ({ apollosId }, args, { dataSources }) =>
    dataSources.Likes.getIsLikedForCurrentUserAndNode({
      nodeId: apollosId,
    }),
};

const resolvers = {
  Mutation: {
    updateLikeNode: async (
      root,
      { input: { nodeId, operation } },
      { dataSources },
      resolveInfo
    ) =>
      dataSources.Likes.updateLikeNode({
        nodeId,
        operation,
        resolveInfo,
      }),
  },
  Query: {
    likedContent: async (root, args, { dataSources }) =>
      dataSources.ContentItem.paginate({
        cursor: (fetchArgs) =>
          dataSources.Likes.getForCurrentUser({
            type: 'ContentItem',
            ...fetchArgs,
          }),
        ...args,
      }),
  },
  UniversalContentItem: defaultContentItemResolvers,
  DevotionalContentItem: defaultContentItemResolvers,
  ContentSeriesContentItem: defaultContentItemResolvers,
  WeekendContentItem: defaultContentItemResolvers,
  MediaContentItem: defaultContentItemResolvers,
};

export { resolvers as default };
