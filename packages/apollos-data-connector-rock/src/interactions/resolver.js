export default {
  Mutation: {
    interactWithNode: (root, args, { dataSources }, { schema }) =>
      dataSources.Interactions.createNodeInteraction({ ...args, schema }),
  },
  InteractionResult: {
    node: ({ nodeId }, args, { dataSources, models }, info) =>
      models.Node.get(nodeId, dataSources, info),
  },
};
