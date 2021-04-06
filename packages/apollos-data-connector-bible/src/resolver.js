import { createGlobalId } from '@apollosproject/server-core';

export default {
  Query: {
    scripture: (root, { query, version }, { dataSources }) =>
      dataSources.Scripture.getScripture(query, version),
    scriptures: (root, { query, version }, { dataSources }) =>
      dataSources.Scripture.getScriptures(query, version),
  },
  Scripture: {
    id: ({ id, bibleId }, args, context, { parentType }) =>
      createGlobalId(JSON.stringify({ id, bibleId }), parentType.name),
    html: ({ content }) => content,
    book: ({ bookId }, __, { dataSources: { Scripture } }) =>
      Scripture.getBook(bookId),
  },
};
