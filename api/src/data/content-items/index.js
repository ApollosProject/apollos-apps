import { gql } from 'apollo-server';
import { get } from 'lodash';
import flow from 'lodash/fp/flow';
import omitBy from 'lodash/fp/omitBy';
import pickBy from 'lodash/fp/pickBy';
import mapValues from 'lodash/fp/mapValues';
import values from 'lodash/fp/values';
import sanitizeHtml from '../../utils/sanitize-html';
import { Constants } from '../../connectors/rock';
import { createGlobalId } from '../node';

const mapValuesWithKey = mapValues.convert({ cap: false });

export { default as model } from './model';

export const schema = gql`
  type ContentItem implements Node {
    id: ID!
    title: String

    childContentItemsConnection(
      first: Int
      after: String
    ): ContentItemsConnection

    parentChannel: ContentChannel
    # parentContent: ContentItem

    images: [ImageMedia]
    video: [VideoMedia]
    audio: [AudioMedia]

    htmlContent: String

    terms(match: String): [Term]

    # theme: TODO
  }

  type Term {
    key: String
    value: String
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

const isImage = ({ key, attributeValues, attributes }) =>
  attributes[key].fieldTypeId === Constants.FIELD_TYPES.IMAGE ||
  (key.toLowerCase().includes('image') &&
    attributeValues[key].value.startsWith('http')); // looks like an image url

const isVideo = ({ key, attributeValues, attributes }) =>
  attributes[key].fieldTypeId === Constants.FIELD_TYPES.VIDEO_FILE ||
  attributes[key].fieldTypeId === Constants.FIELD_TYPES.VIDEO_URL ||
  (key.toLowerCase().includes('video') &&
    attributeValues[key].value.startsWith('http')); // looks like a video url

const isAudio = ({ key, attributeValues, attributes }) =>
  attributes[key].fieldTypeId === Constants.FIELD_TYPES.AUDIO_FILE ||
  attributes[key].fieldTypeId === Constants.FIELD_TYPES.AUDIO_URL ||
  (key.toLowerCase().includes('audio') &&
    attributeValues[key].value.startsWith('http')); // looks like an audio url

export const resolver = {
  ContentItem: {
    id: ({ id }, _, $, { parentType }) => createGlobalId(id, parentType.name),
    htmlContent: ({ content }) => sanitizeHtml(content),
    childContentItemsConnection: async ({ id }, input, { models }) =>
      models.ContentItem.paginate({
        cursor: await models.ContentItem.getCursorByParentContentItemId(id),
        input,
      }),

    terms: ({ attributeValues, attributes }, { match }) =>
      flow([
        omitBy((value, key) => isImage({ key, attributes, attributeValues })),
        omitBy((value, key) => isVideo({ key, attributes, attributeValues })),
        omitBy((value, key) => isAudio({ key, attributes, attributeValues })),
        omitBy((value, key) => key === 'videoEmbed'),
        pickBy((value, key) => (match ? key.match(match) : true)),
        mapValuesWithKey(({ value }, key) => ({
          key,
          value,
        })),
        values,
      ])(attributeValues),

    images: ({ attributeValues, attributes }) => {
      const imageKeys = Object.keys(attributes).filter((key) =>
        isImage({
          key,
          attributeValues,
          attributes,
        })
      );
      return imageKeys.map((key) => ({
        key,
        name: attributes[key].name,
        sources: [{ uri: attributeValues[key].value }],
      }));
    },

    video: ({ attributeValues, attributes }) => {
      const videoKeys = Object.keys(attributes).filter((key) =>
        isVideo({
          key,
          attributeValues,
          attributes,
        })
      );
      return videoKeys.map((key) => ({
        key,
        name: attributes[key].name,
        embedHtml: get(attributeValues, 'videoEmbed.value', null), // TODO: this assumes that the key `VideoEmebed` is always used on Rock
        sources: [{ uri: attributeValues[key].value }],
      }));
    },

    audio: ({ attributeValues, attributes }) => {
      const audioKeys = Object.keys(attributes).filter((key) =>
        isAudio({
          key,
          attributeValues,
          attributes,
        })
      );
      return audioKeys.map((key) => ({
        key,
        name: attributes[key].name,
        sources: [{ uri: attributeValues[key].value }],
      }));
    },
  },
};
