export default {
  Query: {
    node: (root, { id }, { models, dataSources }, resolveInfo) =>
      models.Node.get(id, dataSources, resolveInfo),
  },
  Node: {
    __resolveType: ({ __typename, __type, apollosType }, args, resolveInfo) =>
      __typename || apollosType || resolveInfo.schema.getType(__type),
  },
};
