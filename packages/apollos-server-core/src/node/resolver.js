export default {
  Query: {
    node: (root, { id }, { models, dataSources }, resolveInfo) =>
      models.Node.get(id, dataSources, resolveInfo),
  },
  Node: {
    __resolveType: ({ __typename, __type }, args, resolveInfo) =>
      __typename || resolveInfo.schema.getType(__type),
  },
};
