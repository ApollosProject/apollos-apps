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

  sharing: (root, args, { dataSources: { ContentItem } }) => ({
    url: ContentItem.getShareUrl({
      contentId: root.id,
      channelId: root.contentChannelId,
    }),
    title: 'Share via ...',
    message: `${root.title} - ${ContentItem.createSummary(root)}`,
  }),
};

const resolver = {
  Query: {
    campaigns: (root, args, { dataSources }) =>
      dataSources.ContentItem.paginate({
        cursor: dataSources.ContentItem.byContentChannelIds(
          ROCK_MAPPINGS.CAMPAIGN_CHANNEL_IDS
        ),
        args,
      }),
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
  WeekendContentItem: {
    ...defaultContentItemResolvers,
    liveStream: async (
      root,
      args,
      { dataSources: { ContentItem, LiveStream } }
    ) => ({
      ...(await LiveStream.getLiveStream()), // TODO: Wish there was a better way to inherit these defaults from the LiveStream module.
      isLive: await ContentItem.isContentActiveLiveStream(root), // We need to override the global IsLive with an IsLive that is contextual to a ContentItem
    }),
  },
  ContentItem: {
    ...defaultContentItemResolvers,
    __resolveType: (root, { dataSources: { ContentItem } }) =>
      ContentItem.resolveType(root),
  },
  ContentItemsConnection: {
    pageInfo: withEdgePagination,
  },
};

export default resolver;
