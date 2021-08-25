export default {
  Mutation: {
    interactWithNode: (root, args, { dataSources }) =>
      dataSources.Interactions.createNodeInteraction(args),
  },
  InteractionResult: {
    node: ({ nodeId }, args, { dataSources, models }, info) =>
      models.Node.get(nodeId, dataSources, info),
  },
};
