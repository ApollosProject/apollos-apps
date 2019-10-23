/* eslint-disable prefer-template */

import { get } from 'lodash';
import Hypher from 'hypher';
import english from 'hyphenation.en-us';
import {
  createGlobalId,
  withEdgePagination,
} from '@apollosproject/server-core';

import ApollosConfig from '@apollosproject/config';
import sanitizeHtml from '../sanitize-html';

const { ROCK_MAPPINGS } = ApollosConfig;
const hypher = new Hypher(english);

export const defaultContentItemResolvers = {
  id: ({ id }, args, context, { parentType }) =>
    createGlobalId(id, parentType.name),
  htmlContent: ({ content }) => sanitizeHtml(content),
  childContentItemsConnection: async ({ id }, args, { dataSources }) =>
    dataSources.ContentItem.paginate({
      cursor: await dataSources.ContentItem.getCursorByParentContentItemId(id),
      args,
    }),

  title: ({ title }, { hyphenated }) => {
    if (!hyphenated) {
      return title;
    }
    const words = title.split(' ');

    /* We only want to hyphenate the end of words because Hyper uses a language dictionary to add
     * "soft" hyphens at the appropriate places. By only adding "soft" hyphens to the end of we
     * guarantee that words that can fit will and that words that can't fit don't wrap prematurely.
     * Essentially, meaning words will always take up the maximum amount of space they can and only
     * very very long words will wrap after the 7th character.
     *
     * Example:
     * Devotional can be hyphenated as "de-vo-tion-al." However, we hyphenate this word as
     * "devotion-al." This means that the word can always fit but usually return to a new line as
     * "devotional" rather than wrapping mid-word as "devo-tional". There are situations your mind
     * can create where this might a wrap at `devotion-al` but this is a worst worst case scenario
     * and in our tests was exceedingly rare in the English language.
     *
     * Additionally, The magic number below (7) is used here because our current
     * `HorizontalHighlighCard`s have a fixed width of 240px and 7 is the maximum number of capital
     * "W" characters that will fit with a hyphen in our current typography. While this is an
     * unlikely occurrence it represents the worst case scenario for word length.
     *
     * TODO: Expose the hyphenation point to make this more flexible in the future.
     */
    const hyphenateEndOfWord = (word, segment) =>
      word.length > 7 ? word + '\u00AD' + segment : word + segment;

    const hyphenateLongWords = (word, hyphenateFunction) =>
      word.length > 7 ? hyphenateFunction(word) : word;

    return words
      .map((w) =>
        hyphenateLongWords(w, () =>
          hypher.hyphenate(w).reduce(hyphenateEndOfWord)
        )
      )
      .join(' ');
  },

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
