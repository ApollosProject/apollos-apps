const resolver = {
  Query: {
    currentUser: (root, args, { dataSources }) =>
      dataSources.Authentication.getCurrentPerson(),
  },
  Mutation: {
    requestLogin: (root, { identity }, { dataSources: { Authentication } }) => {
      return Authentication.requestLogin({ identity });
    },
    requestRegister: (
      root,
      { identity },
      { dataSources: { Authentication } }
    ) => {
      console.log('request register');
      return Authentication.requestRegister({ identity });
    },
    validateLogin: (
      root,
      { identity, otp },
      { dataSources: { Authentication } }
    ) => {
      return Authentication.validateLogin({ identity, otp });
    },
    requestLinkCode: (root, { input }, { dataSources: { Authentication } }) => {
      console.log('🟧 requestLinkCode');
      console.log('input:', input);

      return Authentication.requestLinkCode({ input });
    },
    claimLinkCode: (root, { input }, { dataSources: { Authentication } }) => {
      console.log('🟧 claimLinkCode');
      console.log('input:', input);

      return Authentication.claimLinkCode({ input });
    },
    refreshSession: (root, args, { dataSources: { Authentication } }) => {
      return Authentication.refreshSession(args);
    },
  },
};

export default resolver;
