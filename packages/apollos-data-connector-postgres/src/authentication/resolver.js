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
    requestDeviceOtp: (
      root,
      { identity },
      { dataSources: { Authentication } }
    ) => {
      console.log('🟧 requestDeviceOTP');
      console.log('identity:', identity);

      return Authentication.requestDeviceOtp({ identity });
    },
    refreshSession: (root, args, { dataSources: { Authentication } }) => {
      return Authentication.refreshSession(args);
    },
  },
};

export default resolver;
