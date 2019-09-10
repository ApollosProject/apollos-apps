export default {
  Query: {
    node: (root, { id }, { models, dataSources }, { schema }) =>
      models.Node.get(id, dataSources, schema),
  },
  Node: {
    __resolveType: ({ __typename, __type }, args, { schema }) =>
      __typename || schema.getType(__type),
  },
};
