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
    initialPrompt: (
      { attributeValues },
      args,
      { dataSources: { ContentItem } }
    ) => ContentItem.getAddCommentInitialPrompt(attributeValues),
    addPrompt: ({ attributeValues }, args, { dataSources: { ContentItem } }) =>
      ContentItem.getAddCommentAddPrompt(attributeValues),
  },
};

export default resolvers;
