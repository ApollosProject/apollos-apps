const resolver = {
  Mutation: {
    requestSmsLoginPin: (root, { phoneNumber }, { dataSources }) =>
      dataSources.AuthSms.requestSmsLogin({ phoneNumber }),
    authenticateWithSms: (root, { phoneNumber, pin }, { dataSources }) =>
      dataSources.AuthSms.authenticateWithSms({ phoneNumber, pin }),
  },
};

export default resolver;
