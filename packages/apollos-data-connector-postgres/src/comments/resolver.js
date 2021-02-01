import { createGlobalId } from '@apollosproject/server-core';

const resolvers = {
  Mutation: {
    addComment: (root, args, { dataSources: { Comment } }) =>
      Comment.addComment(args),
    flagComment: (root, args, { dataSources: { UserFlag } }) =>
      UserFlag.flagComment(args),
  },
  Comment: {
    person: (root, args, { dataSources: { Comment } }) =>
      Comment.getPerson(root),
    id: ({ apollosId }) => apollosId,
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
