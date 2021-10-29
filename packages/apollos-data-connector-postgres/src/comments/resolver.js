import { createGlobalId } from '@apollosproject/server-core';

const resolvers = {
  Mutation: {
    addComment: (root, args, { dataSources: { Comment } }) =>
      Comment.addComment(args),
    updateComment: (root, args, { dataSources: { Comment } }) =>
      Comment.updateComment(args),
    deleteComment: (root, args, { dataSources: { Comment } }) =>
      Comment.deleteComment(args),
    flagComment: (root, args, { dataSources: { UserFlag } }) =>
      UserFlag.flagComment(args),
    likeComment: (root, args, { dataSources: { UserLike } }) =>
      UserLike.updateLikeComment({ ...args, operation: 'Like' }),
    unlikeComment: (root, args, { dataSources: { UserLike } }) =>
      UserLike.updateLikeComment({ ...args, operation: 'Unlike' }),
  },
  Comment: {
    person: (root) => root.person || root.getPerson(),
    id: ({ apollosId }) => apollosId,
    isLiked: (root, args, { dataSources: { UserLike } }) =>
      UserLike.userLikedNode({ ...root, nodeId: root.apollosId }),
  },
  CommentListFeature: {
    comments: ({ id, data, parentType, parentId }, args, { dataSources }) => {
      // Old mechanism, based on Rock.
      if (!data) {
        return dataSources.Comment.getForNode(JSON.parse(id));
      }
      // New mechanism, based on Postgres
      return dataSources.Comment.getForNode({
        parentId,
        parentType,
        flagLimit: data.flagLimit,
      });
    },
  },
  AddCommentFeature: {
    initialPrompt: ({ id, data }) =>
      data?.initialPrompt || JSON.parse(id).initialPrompt,
    addPrompt: ({ id, data }) => data?.addPrompt || JSON.parse(id).addPrompt,
    prompt: ({ data }) => data.prompt ?? 'What stands out to you?',
    relatedNode: async (
      { id, parentType, parentId },
      args,
      { models: { Node }, dataSources },
      info
    ) => {
      if (parentType && parentId) {
        return Node.get(
          createGlobalId(parentId, parentType),
          dataSources,
          info
        );
      }
      const { relatedNode } = JSON.parse(id);
      return Node.get(
        createGlobalId(relatedNode.id, relatedNode.__type),
        dataSources,
        info
      );
    },
  },
};

export default resolvers;
