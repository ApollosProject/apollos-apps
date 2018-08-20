export default {
  Mutation: {
    createSession: (root, args, { dataSources }) =>
      dataSources.Interactions.createSession(),
    createInteraction: async (
      root,
      { input: { nodeId, sessionId, operation } },
      { dataSources }
    ) =>
      dataSources.Interactions.createInteraction({
        nodeId,
        sessionId,
        operationName: operation,
      }),
  },
};
