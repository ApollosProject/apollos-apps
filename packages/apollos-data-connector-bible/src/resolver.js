import { createGlobalId } from '@apollosproject/server-core';

export default {
  Query: {
    scripture: (root, { query }, { dataSources }) =>
      dataSources.Scripture.getScripture(query),
    scriptures: (root, { query }, { dataSources }) =>
      dataSources.Scripture.getScriptures(query),
  },
  Scripture: {
    id: ({ id }, args, context, { parentType }) =>
      createGlobalId(id, parentType.name),
    html: ({ content }) => content,
  },
};
