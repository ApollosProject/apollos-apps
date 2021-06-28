import { get } from 'lodash';
import { withEdgePagination } from '@apollosproject/server-core';
import ApollosConfig from '@apollosproject/config';

const { ROCK, ROCK_MAPPINGS } = ApollosConfig;

export const defaultContentItemResolvers = {
  id: ({ apollosId }) => apollosId,
  childContentItemsConnection: async (model, args, { dataSources }) =>
    dataSources.ContentItem.paginate({
      ...args,
      cursor: model.getChildren.bind(model),
    }),

  title: ({ title }, { hyphenated }, { dataSources }) =>
    hyphenated
      ? dataSources.ContentItem.createHyphenatedString({ text: title })
      : title,

  // parentChannel: (
  //   { contentChannel, contentChannelId },
  //   args,
  //   { dataSources }
  // ) => contentChannel || dataSources.ContentChannel.getFromId(contentChannelId),

  // siblingContentItemsConnection: async ({ id }, args, { dataSources }) =>
  //   dataSources.ContentItem.paginate({
  //     cursor: await dataSources.ContentItem.getCursorBySiblingContentItemId(id),
  //     args,
  //   }),

  //   images: (root, args, { dataSources: { ContentItem } }) =>
  //     ContentItem.getImages(root),
  //
  //   videos: (root, args, { dataSources: { ContentItem } }) =>
  //     ContentItem.getVideos(root),
  //
  //   audios: (root, args, { dataSources: { ContentItem } }) =>
  //     ContentItem.getAudios(root),
  //
  //   coverImage: (root, args, { dataSources: { ContentItem } }) =>
  //     ContentItem.getCoverImage(root),

  publishDate: ({ publishAt }) => publishAt,

  theme: () => null, // todo: integrate themes from Rock

  sharing: (root, args, { dataSources: { ContentItem } }) => ({
    url: ContentItem.getShareUrl(root),
    title: 'Share via ...',
    message: `${root.title} - ${ContentItem.createSummary(root)}`,
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
    // personaFeed: async (root, args, { dataSources }) => {
    //   const personaFeed = await dataSources.ContentItem.byPersonaFeed(
    //     args.first
    //   );
    //   return dataSources.ContentItem.paginate({
    //     cursor: personaFeed,
    //     args,
    //   });
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
    // upNext: (root, args, { dataSources }) =>
    //   dataSources.ContentItem.getUpNext(root),
    // percentComplete: (root, args, { dataSources }) =>
    //   dataSources.ContentItem.getPercentComplete(root),
  },
  MediaContentItem: {
    ...defaultContentItemResolvers,
  },
  WeekendContentItem: {
    ...defaultContentItemResolvers,
    // liveStream: async (
    //   root,
    //   args,
    //   { dataSources: { ContentItem, LiveStream } }
    // ) => ({
    //   ...(await LiveStream.getLiveStream()), // TODO: Wish there was a better way to inherit these defaults from the LiveStream module.
    //   isLive: await ContentItem.isContentActiveLiveStream(root), // We need to override the global IsLive with an IsLive that is contextual to a ContentItem
    // }),
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
