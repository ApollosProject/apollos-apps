const resolvers = {
  Mutation: {
    requestFollow: (root, args, { dataSources: { FollowRequest } }) =>
      FollowRequest.requestFollow(args),
  },
};

export default resolvers;
