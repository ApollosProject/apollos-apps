const resolvers = {
  Query: {
    openIdProviders: (root, args, { dataSources }) =>
      dataSources.OpenIdIdentity.getProviders(),
  },
  Mutation: {
    connectOpenId: (root, { code, providerType }, { dataSources }) =>
      dataSources.OpenIdIdentity.registerCode({ code, type: providerType }),
  },
  OpenIdProvider: {
    authorizationUrl: (root) =>
      root.client.authorizationUrl({
        scope: 'openid email profile offline_access address apollos',
      }),
  },
};

export default resolvers;
