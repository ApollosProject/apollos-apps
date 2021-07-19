const resolver = {
  Query: {
    contentChannels: (root, args, context) =>
      context.dataSources.ContentChannel.model.findAll(),
  },
  ContentChannel: {
    id: ({ apollosId }) => apollosId,
    name: ({ title }) => title,
    childContentItemsConnection: ({ id }, args, { dataSources }) =>
      dataSources.ContentItem.paginate({
        cursor: (filterArgs) =>
          dataSources.ContentItem.getFromCategoryIds([id], filterArgs),
        ...args,
      }),
    // TODO
    // iconName: () => 'text',
  },
};

export default resolver;
