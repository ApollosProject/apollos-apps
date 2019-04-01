import { get } from 'lodash';
import {
  createGlobalId,
  withEdgePagination,
} from '@apollosproject/server-core';

import ApollosConfig from '@apollosproject/config';
import sanitizeHtml from '../sanitize-html';

const { ROCK_MAPPINGS } = ApollosConfig;

export const defaultContentItemResolvers = {
  id: ({ id }, args, context, { parentType }) =>
    createGlobalId(id, parentType.name),
  htmlContent: ({ content }) => sanitizeHtml(content),
  childContentItemsConnection: async ({ id }, args, { dataSources }) =>
    dataSources.ContentItem.paginate({
      cursor: await dataSources.ContentItem.getCursorByParentContentItemId(id),
      args,
    }),

  parentChannel: ({ contentChannelId }, args, { dataSources }) =>
    dataSources.ContentChannel.getFromId(contentChannelId),

  siblingContentItemsConnection: async ({ id }, args, { dataSources }) =>
    dataSources.ContentItem.paginate({
      cursor: await dataSources.ContentItem.getCursorBySiblingContentItemId(id),
      args,
    }),

  summary: (root, args, { dataSources: { ContentItem } }) =>
    ContentItem.createSummary(root),

  images: (root, args, { dataSources: { ContentItem } }) =>
    ContentItem.getImages(root),

  videos: (root, args, { dataSources: { ContentItem } }) =>
    ContentItem.getVideos(root),

  audios: (root, args, { dataSources: { ContentItem } }) =>
    ContentItem.getAudios(root),

  coverImage: (root, args, { dataSources: { ContentItem } }) =>
    ContentItem.getCoverImage(root),

  theme: () => null, // todo: integrate themes from Rock

  sharing: (root) => ({ __type: 'SharableContentItem', ...root }),
};

const resolver = {
  Query: {
    userFeed: (root, args, { dataSources }) =>
      dataSources.ContentItem.paginate({
        cursor: dataSources.ContentItem.byUserFeed(),
        args,
      }),
    personaFeed: async (root, args, { dataSources }) => {
      const personaFeed = await dataSources.ContentItem.byPersonaFeed(
        args.first
      );
      return dataSources.ContentItem.paginate({
        cursor: personaFeed,
        args,
      });
    },
  },
  DevotionalContentItem: {
    ...defaultContentItemResolvers,
    scriptures: ({ attributeValues }, args, { dataSources }) => {
      const reference = get(attributeValues, 'scriptures.value');
      if (reference && reference != null) {
        return dataSources.Scripture.getScriptures(reference);
      }
      return null;
    },
  },
  UniversalContentItem: {
    ...defaultContentItemResolvers,
  },
  ContentSeriesContentItem: {
    ...defaultContentItemResolvers,
  },
  MediaContentItem: {
    ...defaultContentItemResolvers,
  },
  ContentItem: {
    ...defaultContentItemResolvers,
    __resolveType: async (
      { attributeValues, attributes, contentChannelTypeId },
      { dataSources: { ContentItem } }
    ) => {
      // if we have defined an ContentChannelTypeId based maping in the YML file, use it!
      if (
        Object.values(ROCK_MAPPINGS.CONTENT_ITEM).some(
          ({ ContentChannelTypeId }) =>
            ContentChannelTypeId &&
            ContentChannelTypeId.includes(contentChannelTypeId)
        )
      ) {
        return Object.keys(ROCK_MAPPINGS.CONTENT_ITEM).find((key) => {
          const value = ROCK_MAPPINGS.CONTENT_ITEM[key];
          return (
            value.ContentChannelTypeId &&
            value.ContentChannelTypeId.includes(contentChannelTypeId)
          );
        });
      }

      if (ContentItem.hasMedia({ attributeValues, attributes })) {
        return 'MediaContentItem';
      }

      return 'UniversalContentItem';
    },
  },
  SharableContentItem: {
    url: () => 'https://apollosrock.newspring.cc/', // todo: return a dynamic url that links to the content item
    title: ({ title }) => title,
    message: () => '',
  },
  ContentItemsConnection: {
    pageInfo: withEdgePagination,
  },
};

export default resolver;
