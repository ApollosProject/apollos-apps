import { createGlobalId } from '@apollosproject/server-core';

const defaultContentItemResolvers = {
  likedCount: ({ id }, args, { dataSources }) =>
    dataSources.Followings.getFollowingsCountByNodeId({
      nodeId: createGlobalId(id, 'ContentItem'),
    }),

  isLiked: async ({ id, isLiked }, args, { dataSources }) => {
    if (isLiked != null) return isLiked;

    const followings = await dataSources.Followings.getFollowingsForCurrentUserAndNode(
      {
        nodeId: createGlobalId(id, 'ContentItem'),
      }
    );

    return followings.length > 0;
  },
};

const resolvers = {
  Mutation: {
    updateLikeEntity: async (
      root,
      { input: { nodeId, operation } },
      { dataSources },
      { schema }
    ) =>
      dataSources.Followings.updateLikeContentItem({
        nodeId,
        operation,
        schema,
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
  MediaContentItem: defaultContentItemResolvers,
};

export { resolvers as default };
