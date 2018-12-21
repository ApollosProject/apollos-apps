export default {
  Mutation: {
    updateUserPushSettings: (root, { input }, { dataSources }) =>
      dataSources.OneSignal.updatePushSettings(input),
  },
};
