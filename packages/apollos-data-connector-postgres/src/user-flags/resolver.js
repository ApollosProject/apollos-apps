const resolvers = {
  UserFlag: {
    person: (root, args, { dataSources: { UserFlag } }) =>
      UserFlag.getPerson(root),
    comment: (root, args, { dataSources: { UserFlag } }) =>
      UserFlag.getComment(root),
    id: ({ apollosId }) => apollosId,
  },
};

export default resolvers;
