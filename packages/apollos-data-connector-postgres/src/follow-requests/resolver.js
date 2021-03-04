import { FollowState } from './model';

const resolvers = {
  Mutation: {
    requestFollow: (root, args, { dataSources: { FollowRequest } }) =>
      FollowRequest.requestFollow(args),
    acceptFollowRequest: (root, args, { dataSources: { FollowRequest } }) =>
      FollowRequest.acceptFollowRequest(args),
    ignoreFollowRequest: (root, args, { dataSources: { FollowRequest } }) =>
      FollowRequest.ignoreFollowRequest(args),
  },
  FollowRequestResult: {
    following: ({ state }) => state === FollowState.ACCEPTED,
  },
};

export default resolvers;
