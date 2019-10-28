import { createGlobalId } from '@apollosproject/server-core';
import ApollosConfig from '@apollosproject/config';

const { BIBLE_API } = ApollosConfig;
// default to the first one listed in the config
const defaultVersion = Object.values(BIBLE_API)[0];

export default {
  Query: {
    scripture: (root, { query, version = defaultVersion }, { dataSources }) =>
      dataSources.Scripture.getScripture(query, version),
    scriptures: (root, { query, version = defaultVersion }, { dataSources }) =>
      dataSources.Scripture.getScriptures(query, version),
  },
  Scripture: {
    id: ({ id, version }, args, context, { parentType }) =>
      createGlobalId(JSON.stringify({ id, version }), parentType.name),
    html: ({ content }) => content,
  },
};
