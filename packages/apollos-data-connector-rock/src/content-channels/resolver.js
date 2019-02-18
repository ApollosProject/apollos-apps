import { createGlobalId } from '@apollosproject/server-core';

const resolver = {
  Query: {
    contentChannels: (root, args, context) =>
      context.dataSources.ContentChannel.getRootChannels(),
  },
  ContentChannel: {
    id: ({ id }, args, context, { parentType }) =>
      createGlobalId(id, parentType.name),
    childContentItemsConnection: ({ id }, args, { dataSources }) =>
      dataSources.ContentItem.paginate({
        cursor: dataSources.ContentItem.byContentChannelId(id),
        args,
      }),
    iconName: () => 'text', // TODO
  },
};

export default resolver;
