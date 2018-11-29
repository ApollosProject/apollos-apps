import { get } from 'lodash';

export default {
  Query: {
    scripture: (root, { query }, { dataSources }) =>
      dataSources.Scripture.getScripture(query),
  },
  Scripture: {
    id: ({ data: { passages } = {} }) => get(passages, '[0].id'),
    html: ({ data: { passages } = {} }) => get(passages, '[0].content'),
    reference: ({ data: { passages } = {} }) => get(passages, '[0].reference'),
    copyright: ({ data: { passages } = {} }) => get(passages, '[0].copyright'),
  },
  DevotionalContentItem: {
    scriptures: ({ attributeValues }, args, { dataSources }) => {
      const reference = get(attributeValues, 'scriptures.value');
      if (reference && reference != null) {
        return dataSources.Scripture.getScriptures(reference);
      }
      return null;
    },
  },
};
