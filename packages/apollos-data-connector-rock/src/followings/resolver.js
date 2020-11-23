import { createGlobalId } from '@apollosproject/server-core';

const defaultContentItemResolvers = {
  likedCount: ({ id }, args, { dataSources }) =>
    dataSources.Followings.getFollowingsCountByNodeId({
      nodeId: createGlobalId(id, 'ContentItem'),
    }),

  isLiked: async ({ id, isLiked }, args, { dataSources }) =>
    dataSources.Followings.getIsLikedForCurrentUserAndNode({
      nodeId: createGlobalId(id, 'ContentItem'),
      isLiked,
    }),
};

const resolvers = {
  Mutation: {
    updateLikeEntity: async (
      root,
      { input: { nodeId, operation } },
      { dataSources },
      resolveInfo
    ) =>
      dataSources.Followings.updateLikeContentItem({
        nodeId,
        operation,
        resolveInfo,
      }),
    updateLikeNode: async (
      root,
      { input: { nodeId, operation } },
      { dataSources },
      resolveInfo
    ) =>
      dataSources.Followings.updateLikeNode({
        nodeId,
        operation,
        resolveInfo,
      }),
  },
  Query: {
    likedContent: async (root, { after, first }, { dataSources }) => {
      const followingsPaginated = await dataSources.Followings.paginatedGetFollowingsForCurrentUser(
        { type: 'ContentItem', after, first }
      );

      const followings = await followingsPaginated.edges;
      const ids = followings.map((f) => f.node.entityId);
      const contentItems = await dataSources.ContentItem.getFromIds(ids).get();
      const contentItemEdges = contentItems.map((contentItem) => ({
        node: { ...contentItem, isLiked: true },
        following: followings.find((f) => f.node.entityId === contentItem.id)
          .node,
        cursor: followings.find((f) => f.node.entityId === contentItem.id)
          .cursor,
      }));
      const sortedContentItemEdges = contentItemEdges.sort(
        (a, b) =>
          new Date(a.following.createdDateTime) <
          new Date(b.following.createdDateTime)
      );

      return { edges: sortedContentItemEdges };
    },
  },
  UniversalContentItem: defaultContentItemResolvers,
  DevotionalContentItem: defaultContentItemResolvers,
  ContentSeriesContentItem: defaultContentItemResolvers,
  WeekendContentItem: defaultContentItemResolvers,
  MediaContentItem: defaultContentItemResolvers,
};

export { resolvers as default };
