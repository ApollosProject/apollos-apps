import { Sequelize } from 'sequelize';
import { get } from 'lodash';
import { withEdgePagination } from '@apollosproject/server-core';

export const defaultContentItemResolvers = {
  id: ({ apollosId, id, __typename }) =>
    apollosId || [__typename, id].join(':'),
  childContentItemsConnection: async (model, args, { dataSources }) =>
    dataSources.ContentItem.paginate({
      cursor: (fetchArgs) =>
        dataSources.ContentItem.getChildren(model, {
          order: [
            [Sequelize.literal('"contentItemsConnection".order'), 'ASC'],
            ['publishAt', 'ASC'],
          ],
          ...fetchArgs,
        }),
      ...args,
    }),

  title: ({ title }, { hyphenated }, { dataSources }) =>
    hyphenated
      ? dataSources.ContentItem.createHyphenatedString({ text: title })
      : title,

  parentChannel: (model) => model.getContentItemCategory(),

  siblingContentItemsConnection: async (model, args, { dataSources }) =>
    dataSources.ContentItem.paginate({
      cursor: (fetchArgs) =>
        dataSources.ContentItem.getSiblings(model, {
          order: [
            [Sequelize.literal('"contentItemsConnection".order'), 'ASC'],
            ['publishAt', 'ASC'],
          ],
          ...fetchArgs,
        }),
      ...args,
    }),

  images: (model) => model.images || model.getImages(),
  videos: (model) => model.videos || model.getVideos(),
  audios: (model) => model.audios || model.getAudios(),
  //
  coverImage: (model) => model.getCoverImage(),

  publishDate: ({ publishAt }) => publishAt,

  theme: () => null, // todo: integrate themes from Rock

  sharing: (root, args, { dataSources: { ContentItem } }) => ({
    url: ContentItem.getShareUrl(root),
    title: 'Share via ...',
    message: `${root.title} - ${root.summary}`,
  }),
};

const resolver = {
  Query: {
    campaigns: (root, args, { dataSources }) =>
      dataSources.ContentItem.paginate({
        ...args,
      }),
    userFeed: (root, args, { dataSources }) =>
      dataSources.ContentItem.paginate({
        ...args,
      }),
    personaFeed: async (root, args, { dataSources }) => {
      return dataSources.ContentItem.paginate({
        cursor: dataSources.ContentItem.byPersonaFeed,
        ...args,
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
    upNext: (root, args, { dataSources }) =>
      dataSources.ContentItem.getUpNext(root),
    percentComplete: (root, args, { dataSources }) =>
      dataSources.ContentItem.getPercentComplete(root),
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
    __resolveType: (root) => root.apollosType,
  },
  ContentItemsConnection: {
    totalCount: ({ getTotalCount }) => getTotalCount(),
    pageInfo: withEdgePagination,
  },
};

export default resolver;
