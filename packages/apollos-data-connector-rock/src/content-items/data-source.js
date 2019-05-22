import { get } from 'lodash';
import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import ApollosConfig from '@apollosproject/config';
import moment from 'moment-timezone';
import natural from 'natural';
import sanitizeHtmlNode from 'sanitize-html';

import { createImageUrlFromGuid } from '../utils';

const { ROCK, ROCK_MAPPINGS, ROCK_CONSTANTS } = ApollosConfig;

export default class ContentItem extends RockApolloDataSource {
  resource = 'ContentChannelItems';

  attributeIsImage = ({ key, attributeValues, attributes }) =>
    attributes[key].fieldTypeId === ROCK_CONSTANTS.IMAGE ||
    (key.toLowerCase().includes('image') &&
      typeof attributeValues[key].value === 'string' &&
      attributeValues[key].value.startsWith('http')); // looks like an image url

  attributeIsVideo = ({ key, attributeValues, attributes }) =>
    attributes[key].fieldTypeId === ROCK_CONSTANTS.VIDEO_FILE ||
    attributes[key].fieldTypeId === ROCK_CONSTANTS.VIDEO_URL ||
    (key.toLowerCase().includes('video') &&
      typeof attributeValues[key].value === 'string' &&
      attributeValues[key].value.startsWith('http')); // looks like a video url

  attributeIsAudio = ({ key, attributeValues, attributes }) =>
    attributes[key].fieldTypeId === ROCK_CONSTANTS.AUDIO_FILE ||
    attributes[key].fieldTypeId === ROCK_CONSTANTS.AUDIO_URL ||
    (key.toLowerCase().includes('audio') &&
      typeof attributeValues[key].value === 'string' &&
      attributeValues[key].value.startsWith('http')); // looks like an audio url

  hasMedia = ({ attributeValues, attributes }) =>
    Object.keys(attributes).filter((key) =>
      this.attributeIsVideo({
        key,
        attributeValues,
        attributes,
      })
    ).length ||
    Object.keys(attributes).filter((key) =>
      this.attributeIsAudio({
        key,
        attributeValues,
        attributes,
      })
    ).length;

  getImages = ({ attributeValues, attributes }) => {
    const imageKeys = Object.keys(attributes).filter((key) =>
      this.attributeIsImage({
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
        ? [{ uri: createImageUrlFromGuid(attributeValues[key].value) }]
        : [],
    }));
  };

  getVideos = ({ attributeValues, attributes }) => {
    const videoKeys = Object.keys(attributes).filter((key) =>
      this.attributeIsVideo({
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
  };

  getAudios = ({ attributeValues, attributes }) => {
    const audioKeys = Object.keys(attributes).filter((key) =>
      this.attributeIsAudio({
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
  };

  createSummary = ({ content, summary }) => {
    if (summary) return summary;
    if (!content || typeof content !== 'string') return '';
    // Protect against 0 length sentences (tokenizer will throw an error)
    if (content.split(' ').length === 1) return '';

    const tokenizer = new natural.SentenceTokenizer();
    return tokenizer.tokenize(
      sanitizeHtmlNode(content, {
        allowedTags: [],
        allowedAttributes: [],
      })
    )[0];
  };

  async getCoverImage(root) {
    const pickBestImage = (images) => {
      // TODO: there's probably a _much_ more explicit and better way to handle this
      const squareImage = images.find((image) =>
        image.key.toLowerCase().includes('square')
      );
      if (squareImage) return { ...squareImage, __typename: 'ImageMedia' };
      return { ...images[0], __typename: 'ImageMedia' };
    };

    const ourImages = this.getImages(root).filter(
      (image) => image.sources.length
    ); // filter images w/o URLs
    if (ourImages.length) return pickBestImage(ourImages);

    // If no image, check parent for image:
    const parentItemsCursor = await this.getCursorByChildContentItemId(root.id);
    if (!parentItemsCursor) return null;

    const parentItems = await parentItemsCursor.get();

    if (parentItems.length) {
      const parentImages = parentItems
        .map(this.getImages)
        .find((images) => images.length);

      if (!parentImages) return null;

      const validParentImages = parentImages.filter(
        (image) => image.sources.length
      );

      if (validParentImages && validParentImages.length)
        return pickBestImage(validParentImages);
    }

    return null;
  }

  LIVE_CONTENT = () => {
    // get a date in the local timezone of the rock instance.
    // will create a timezone formatted string and then strip off the offset
    // should output something like 2019-03-27T12:27:20 which means 12:27pm in New York
    const date = moment()
      .tz(ROCK.TIMEZONE)
      .format()
      .split(/[-+]\d+:\d+/)[0];
    return `((StartDateTime lt datetime'${date}') or (StartDateTime eq null)) and ((ExpireDateTime gt datetime'${date}') or (ExpireDateTime eq null)) `;
  };

  expanded = true;

  getCursorByParentContentItemId = async (id) => {
    const associations = await this.request('ContentChannelItemAssociations')
      .filter(`ContentChannelItemId eq ${id}`)
      .get();

    if (!associations || !associations.length) return null;

    const request = this.request();

    const associationsFilter = associations.map(
      ({ childContentChannelItemId }) => `Id eq ${childContentChannelItemId}`
    );
    request.filterOneOf(associationsFilter).andFilter(this.LIVE_CONTENT());

    return request.orderBy('Order');
  };

  getCursorByChildContentItemId = async (id) => {
    const associations = await this.request('ContentChannelItemAssociations')
      .filter(`ChildContentChannelItemId eq ${id}`)
      .get();

    if (!associations || !associations.length) return null;
    const request = this.request();
    const associationsFilter = associations.map(
      ({ contentChannelItemId }) => `Id eq ${contentChannelItemId}`
    );

    request.filterOneOf(associationsFilter).andFilter(this.LIVE_CONTENT());

    return request.orderBy('Order');
  };

  getCursorBySiblingContentItemId = async (id) => {
    // Get all parents for the current item.
    const parentAssociations = await this.request(
      'ContentChannelItemAssociations'
    )
      .filter(`ChildContentChannelItemId eq ${id}`)
      .get();

    if (!parentAssociations || !parentAssociations.length) return null;

    // Now, fetch all children relations for those parents (excluding the original item)
    const siblingAssociationsRequest = await this.request(
      'ContentChannelItemAssociations'
    );

    const parentFilter = parentAssociations.map(
      ({ contentChannelItemId }) =>
        `(ContentChannelItemId eq ${contentChannelItemId}) and (ChildContentChannelItemId ne ${id})`
    );
    siblingAssociationsRequest.filterOneOf(parentFilter);

    const siblingAssociations = await siblingAssociationsRequest.get();
    if (!siblingAssociations || !siblingAssociations.length) return null;

    const request = this.request();
    const siblingFilter = siblingAssociations.map(
      ({ childContentChannelItemId }) => `Id eq ${childContentChannelItemId}`
    );
    request.filterOneOf(siblingFilter).andFilter(this.LIVE_CONTENT());

    return request.orderBy('Order');
  };

  // Generates feed based on persons dataview membership
  byPersonaFeed = async (first) => {
    const {
      dataSources: { Person },
    } = this.context;

    // Grabs the guids associated with all dataviews user is memeber
    const getPersonaGuidsForUser = await Person.getPersonas({
      categoryId: ROCK_MAPPINGS.DATAVIEW_CATEGORIES.PersonaId,
    });

    // Grabs content items based on personas
    return this.request(
      `ContentChannelItems/GetFromPersonDataView?guids=${getPersonaGuidsForUser
        .map((obj) => obj.guid)
        .join()}`
    )
      .andFilter(this.LIVE_CONTENT())
      .top(first)
      .orderBy('StartDateTime', 'desc');
  };

  byUserFeed = () =>
    this.request()
      .filterOneOf(
        ROCK_MAPPINGS.FEED_CONTENT_CHANNEL_IDS.map(
          (id) => `ContentChannelId eq ${id}`
        )
      )
      .andFilter(this.LIVE_CONTENT())
      .orderBy('StartDateTime', 'desc');

  byContentChannelId = (id) =>
    this.request()
      .filter(`ContentChannelId eq ${id}`)
      .andFilter(this.LIVE_CONTENT())
      .orderBy('StartDateTime', 'desc');

  byContentChannelIds = (ids = []) =>
    this.request()
      .filterOneOf(ids.map((id) => `ContentChannelId eq ${id}`))
      .andFilter(this.LIVE_CONTENT())
      .orderBy('StartDateTime', 'desc');

  getFromIds = (ids = []) => {
    if (ids.length === 0) return this.request().empty();
    return this.request()
      .filterOneOf(ids.map((id) => `Id eq ${id}`))
      .andFilter(this.LIVE_CONTENT());
  };

  getFromId = (id) =>
    this.request()
      .find(id)
      .get();
}
