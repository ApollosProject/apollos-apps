export default {
  Query: {
    node: (root, { id }, { models, dataSources }, { schema }) =>
      models.Node.get(id, dataSources, schema),
  },
  Node: {
    __resolveType: ({ __type }, args, { schema }) => schema.getType(__type),
  },
};
