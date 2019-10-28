import { createGlobalId } from '@apollosproject/server-core';

export default {
  Query: {
    scripture: (root, { query, version = 'WEB' }, { dataSources }) =>
      dataSources.Scripture.getScripture(query, version),
    scriptures: (root, { query, version = 'WEB' }, { dataSources }) =>
      dataSources.Scripture.getScriptures(query, version),
  },
  Scripture: {
    id: ({ id }, args, context, { parentType }) =>
      createGlobalId(id, parentType.name),
    html: ({ content }) => content,
  },
};
