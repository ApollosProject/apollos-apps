export default {
  Mutation: {
    interactWithNode: (root, args, { dataSources }) =>
      dataSources.Interactions.createNodeInteraction(args),
  },
  InteractionResult: {
    node: ({ nodeId }, args, { dataSources, models }, info) =>
      models.Node.get(nodeId, dataSources, info),
  },
  Interaction: {
    id: (root) => root.apollosId,
    node: (root) => root.contentItem, // In the future, we should look for things beyond content items.
  },
  Query: {
    async interactions(root, args, { dataSources }) {
      return dataSources.Interactions.getInteractionsForCurrentUser({
        actions: args.action ? [args.action] : [],
        nodeIds: args.nodeId ? [args.nodeId] : [],
      });
    },
  },
};
