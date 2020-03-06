export default {
  Mutation: {
    interactWithNode: (root, args, { dataSources }) =>
      dataSources.Interactions.createNodeInteraction(args),
  },
};
