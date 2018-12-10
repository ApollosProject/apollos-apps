import { get } from 'lodash';
import natural from 'natural';
import sanitizeHtmlNode from 'sanitize-html';
import {
  createGlobalId,
  withEdgePagination,
} from '@apollosproject/server-core';
import ApollosConfig from '@apollosproject/config';
import sanitizeHtml from '../sanitize-html';

const { ROCK_CONSTANTS, ROCK_MAPPINGS, ROCK } = ApollosConfig;

const enforceProtocol = (uri) => (uri.startsWith('//') ? `https:${uri}` : uri);

const createImageUrl = (uri) =>
  uri.split('-').length === 5
    ? `${ROCK.IMAGE_URL}?guid=${uri}`
    : enforceProtocol(uri);

// export { default as model } from './model';
export { default as dataSource } from './data-source';
export { contentItemSchema as schema } from '@apollosproject/data-schema';

// Empty fields in rock default to `''`
const hasScripture = ({ attributeValues }) =>
  get(attributeValues, 'scriptures.value', '') !== '';

const isImage = ({ key, attributeValues, attributes }) =>
  attributes[key].fieldTypeId === ROCK_CONSTANTS.IMAGE ||
  (key.toLowerCase().includes('image') &&
    typeof attributeValues[key].value === 'string' &&
    attributeValues[key].value.startsWith('http')); // looks like an image url

const isVideo = ({ key, attributeValues, attributes }) =>
  attributes[key].fieldTypeId === ROCK_CONSTANTS.VIDEO_FILE ||
  attributes[key].fieldTypeId === ROCK_CONSTANTS.VIDEO_URL ||
  (key.toLowerCase().includes('video') &&
    typeof attributeValues[key].value === 'string' &&
    attributeValues[key].value.startsWith('http')); // looks like a video url

const isAudio = ({ key, attributeValues, attributes }) =>
  attributes[key].fieldTypeId === ROCK_CONSTANTS.AUDIO_FILE ||
  attributes[key].fieldTypeId === ROCK_CONSTANTS.AUDIO_URL ||
  (key.toLowerCase().includes('audio') &&
    typeof attributeValues[key].value === 'string' &&
    attributeValues[key].value.startsWith('http')); // looks like an audio url

const hasMedia = ({ attributeValues, attributes }) =>
  Object.keys(attributes).filter((key) =>
    isVideo({
      key,
      attributeValues,
      attributes,
    })
  ).length ||
  Object.keys(attributes).filter((key) =>
    isAudio({
      key,
      attributeValues,
      attributes,
    })
  ).length;

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

  summary: ({ summary, content }) => {
    if (summary) return summary;
    if (content == null) return '';
    // Protect against 0 length sentences (tokenizer will throw an error)
    if (content.split(' ').length === 1) return '';

    const tokenizer = new natural.SentenceTokenizer();
    return tokenizer.tokenize(
      sanitizeHtmlNode(content, {
        allowedTags: [],
        allowedAttributes: [],
      })
    )[0];
  },

  images: ({ attributeValues, attributes }) => {
    const imageKeys = Object.keys(attributes).filter((key) =>
      isImage({
        key,
        attributeValues,
        attributes,
      })
    );
    return imageKeys.map((key) => ({
      __typename: 'ImageMedia',
      key,
      name: attributes[key].name,
      sources: attributeValues[key].value
        ? [{ uri: createImageUrl(attributeValues[key].value) }]
        : [],
    }));
  },

  videos: ({ attributeValues, attributes }) => {
    const videoKeys = Object.keys(attributes).filter((key) =>
      isVideo({
        key,
        attributeValues,
        attributes,
      })
    );
    return videoKeys.map((key) => ({
      __typename: 'VideoMedia',
      key,
      name: attributes[key].name,
      embedHtml: get(attributeValues, 'videoEmbed.value', null), // TODO: this assumes that the key `VideoEmebed` is always used on Rock
      sources: attributeValues[key].value
        ? [{ uri: attributeValues[key].value }]
        : [],
    }));
  },

  audios: ({ attributeValues, attributes }) => {
    const audioKeys = Object.keys(attributes).filter((key) =>
      isAudio({
        key,
        attributeValues,
        attributes,
      })
    );
    return audioKeys.map((key) => ({
      __typename: 'AudioMedia',
      key,
      name: attributes[key].name,
      sources: attributeValues[key].value
        ? [{ uri: attributeValues[key].value }]
        : [],
    }));
  },

  coverImage: async (root, args, { dataSources }) => {
    const pickBestImage = (images) => {
      // TODO: there's probably a _much_ more explicit and better way to handle this
      const squareImage = images.find((image) =>
        image.key.toLowerCase().includes('square')
      );
      if (squareImage) return { ...squareImage, __typename: 'ImageMedia' };
      return { ...images[0], __typename: 'ImageMedia' };
    };

    let defaultImages = defaultContentItemResolvers.images(root) || [];
    defaultImages = defaultImages.filter((image) => image.sources.length); // filter images w/o URLs
    if (defaultImages.length) return pickBestImage(defaultImages);

    // If no image, check parent for image:
    const parentItemsCursor = await dataSources.ContentItem.getCursorByChildContentItemId(
      root.id
    );
    if (!parentItemsCursor) return null;

    const parentItems = await parentItemsCursor.get();

    if (parentItems.length) {
      const parentImages = parentItems
        .map(defaultContentItemResolvers.images)
        .find((images) => images.length)
        .filter((image) => image.sources.length); // filter images w/o URLs

      if (parentImages && parentImages.length)
        return pickBestImage(parentImages);
    }

    return null;
  },

  theme: () => null, // todo: integrate themes from Rock

  sharing: (root) => ({ __type: 'SharableContentItem', ...root }),
};

export const resolver = {
  Query: {
    userFeed: (root, args, { dataSources }) =>
      dataSources.ContentItem.paginate({
        cursor: dataSources.ContentItem.byUserFeed(),
        args,
      }),
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
    __resolveType: async ({
      attributeValues,
      attributes,
      contentChannelTypeId,
    }) => {
      if (
        hasScripture({ attributeValues }) &&
        ROCK_MAPPINGS.DEVOTIONAL_TYPE_IDS.includes(contentChannelTypeId)
      ) {
        return 'DevotionalContentItem';
      }

      if (
        ROCK_MAPPINGS.SERIES_CONTENT_CHANNEL_TYPE_IDS.includes(
          contentChannelTypeId
        )
      ) {
        return 'ContentSeriesContentItem';
      }

      if (hasMedia({ attributeValues, attributes })) {
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
