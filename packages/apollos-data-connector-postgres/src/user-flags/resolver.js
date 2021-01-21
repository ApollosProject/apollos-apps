const resolvers = {
  UserFlag: {
    person: (root, args, { dataSources: { UserFlag } }) =>
      UserFlag.getPerson(root),
    id: ({ apollosId }) => apollosId,
  },
};

export default resolvers;
