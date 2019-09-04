export default {
  Query: {
    node: (root, { id }, { dataSources }) => dataSources.Node.get(id),
  },
  Node: {
    __resolveType: ({ __typename, __type }, args, { schema }) =>
      __typename || schema.getType(__type),
  },
};
