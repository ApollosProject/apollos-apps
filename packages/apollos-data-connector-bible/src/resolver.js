import { createGlobalId } from '@apollosproject/server-core';

export default {
  Query: {
    scripture: (root, { query, version }, { dataSources }) =>
      dataSources.Scripture.getScripture(query, version),
    scriptures: (root, { query, version }, { dataSources }) =>
      dataSources.Scripture.getScriptures(query, version),
  },
  Scripture: {
    id: ({ id, version }, args, context, { parentType }) =>
      createGlobalId(JSON.stringify({ id, version }), parentType.name),
    html: ({ content }) => content,
  },
};
