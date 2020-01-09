const resolver = {
  Mutation: {
    requestSmsLoginPin: (root, { phoneNumber }, { dataSources }) =>
      dataSources.AuthSms.requestSmsLogin({ phoneNumber }),
    authenticateWithSms: (root, { phoneNumber, pin }, { dataSources }) =>
      dataSources.AuthSms.authenticateWithSms({
        phoneNumber,
        pin,
        userProfile: [],
      }),
    registerWithSms: (
      root,
      { phoneNumber, pin, userProfile },
      { dataSources }
    ) =>
      dataSources.AuthSms.authenticateWithSms({
        phoneNumber,
        pin,
        userProfile,
      }),
  },
  Query: {
    userExists: (root, { identity }, { dataSources }) =>
      dataSources.AuthSms.userExists({
        identity,
      }),
  },
};

export default resolver;
