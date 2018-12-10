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
      { dataSources }
    ) =>
      dataSources.Followings.updateLikeContentItem({
        nodeId,
        operation,
      }),
  },
  Query: {
    getAllLikedContent: async (root, args, { dataSources }) => {
      const followings = await dataSources.Followings.getFollowingsForCurrentUser(
        { type: 'ContentItem' }
      );
      const ids = followings.map((f) => f.entityId);
      const contentItems = await dataSources.ContentItem.getFromIds(ids).get();
      const sortedContentItems = contentItems.sort((a, b) => {
        const followA = followings.find((f) => f.entityId === a.id);
        const followB = followings.find((f) => f.entityId === b.id);
        return (
          new Date(followA.createdDateTime) < new Date(followB.createdDateTime)
        );
      });

      return sortedContentItems.map((i) => ({ ...i, isLiked: true }));
    },
  },
  UniversalContentItem: defaultContentItemResolvers,
  DevotionalContentItem: defaultContentItemResolvers,
  ContentSeriesContentItem: defaultContentItemResolvers,
  MediaContentItem: defaultContentItemResolvers,
};

export { resolvers as default };
