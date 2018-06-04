import { gql } from 'apollo-server';
import { get } from 'lodash';
import sanitizeHtml from '../../utils/sanitize-html';
import { Constants } from '../../connectors/rock';
import { createGlobalId } from '../node';

export { default as model } from './model';

export const schema = gql`
  type ContentItem implements Node {
    id: ID!
    title: String

    childContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection

    images: [ImageMedia]
    video: [VideoMedia]
    audio: [AudioMedia]

    htmlContent: String
  }

  type ContentItemsConnection {
    edges: [ContentItemsConnectionEdge]
    # totalCount: Int
    # pageInfo: Pagination
  }

  type ContentItemsConnectionEdge {
    node: ContentItem
    cursor: String
  }
`;

export const resolver = {
  ContentItem: {
    id: ({ id }, _, $, { parentType }) => createGlobalId(id, parentType.name),
    htmlContent: ({ content }) => sanitizeHtml(content),
    childContentItemsConnection: async ({ id }, input, { models }) =>
      models.ContentItem.paginate({
        cursor: await models.ContentItem.getCursorByParentContentItemId(id),
        input,
      }),

    images: ({ attributeValues, attributes }) => {
      const imageKeys = Object.keys(attributes).filter(
        (key) =>
          attributes[key].fieldTypeId === Constants.FIELD_TYPES.IMAGE ||
          (key.toLowerCase().includes('image') &&
            attributeValues[key].value.startsWith('http')) // looks like an image
      );
      return imageKeys.map((key) => ({
        key,
        name: attributes[key].name,
        sources: [{ uri: attributeValues[key].value }],
      }));
    },

    video: ({ attributeValues, attributes }) => {
      const videoKeys = Object.keys(attributes).filter(
        (key) =>
          attributes[key].fieldTypeId === Constants.FIELD_TYPES.VIDEO_FILE ||
          attributes[key].fieldTypeId === Constants.FIELD_TYPES.VIDEO_URL ||
          (key.toLowerCase().includes('video') &&
            attributeValues[key].value.startsWith('http')) // looks like an image
      );
      return videoKeys.map((key) => ({
        key,
        name: attributes[key].name,
        embedHtml: get(attributeValues, 'videoEmbed.value', null), // TODO: this assumes that the key `VideoEmebed` is always used on Rock
        sources: [{ uri: attributeValues[key].value }],
      }));
    },

    audio: ({ attributeValues, attributes }) => {
      const audioKeys = Object.keys(attributes).filter(
        (key) =>
          attributes[key].fieldTypeId === Constants.FIELD_TYPES.AUDIO_FILE ||
          attributes[key].fieldTypeId === Constants.FIELD_TYPES.AUDIO_URL ||
          (key.toLowerCase().includes('audio') &&
            attributeValues[key].value.startsWith('http')) // looks like an image
      );
      return audioKeys.map((key) => ({
        key,
        name: attributes[key].name,
        sources: [{ uri: attributeValues[key].value }],
      }));
    },
  },
};
