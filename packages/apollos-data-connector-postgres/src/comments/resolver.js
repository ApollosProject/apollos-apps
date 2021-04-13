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
    id: ({ id }) => createGlobalId(id, 'CommentListFeature'),
  },
  AddCommentFeature: {
    id: ({ id }) => createGlobalId(id, 'AddCommentFeature'),
    initialPrompt: ({ id }) => JSON.parse(id).initialPrompt,
    addPrompt: ({ id }) => JSON.parse(id).addPrompt,
    relatedNode: async (
      { id },
      args,
      { models: { Node }, dataSources },
      info
    ) => {
      const { relatedNode } = JSON.parse(id);
      const item = await Node.get(
        createGlobalId(relatedNode.id, relatedNode.__type),
        dataSources,
        info
      );

      return item;
    },
  },
};

export default resolvers;
