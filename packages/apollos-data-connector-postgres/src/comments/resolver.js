const resolvers = {
  Mutation: {
    addComment: (root, args, { dataSources: { Comment } }) =>
      Comment.addComment(args),
  },
  Comment: {
    person: (root, args, { dataSources: { Comment } }) =>
      Comment.getPerson(root),
  },
};

export default resolvers;
