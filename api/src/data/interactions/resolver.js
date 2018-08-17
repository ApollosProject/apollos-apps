export default {
  Mutation: {
    createSession: (root, args, { dataSources }) =>
      dataSources.Interactions.createSession(),
    createInteraction: async (
      root,
      { input: { contentId, sessionId, operation } },
      { dataSources }
    ) =>
      dataSources.Interactions.createInteraction({
        contentId,
        sessionId,
        operationName: operation,
      }),
  },
};
