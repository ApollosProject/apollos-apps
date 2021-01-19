const resolvers = {
  Mutation: {
    addComment: (root, args, { dataSources: { Comment } }) =>
      Comment.addComment(args),
  },
  Comment: {
    person: (root, args, { dataSources: { Comment } }) =>
      Comment.getPerson(root),
    id: ({ dataValues }) => {
      return dataValues.apollosId;
    },
  },
};

export default resolvers;
