import { get, flatten } from 'lodash';
import RockApolloDataSource, {
  parseKeyValueAttribute,
} from '@apollosproject/rock-apollo-data-source';
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

  getFeatures({ attributeValues }) {
    const { Features } = this.context.dataSources;
    const features = [];

    // TODO this should replace all other methods
    const genericFeatures = get(attributeValues, 'features.value', '');
    const keyValuePairs = parseKeyValueAttribute(genericFeatures);
    keyValuePairs.forEach(({ key, value }, i) => {
      switch (key) {
        case 'scripture':
          features.push(
            Features.createScriptureFeature({
              reference: value,
              id: `${attributeValues.features.id}-${i}`,
            })
          );
          break;
        case 'text':
          features.push(
            Features.createTextFeature({
              text: value,
              id: `${attributeValues.features.id}-${i}`,
            })
          );
          break;
        default:
          console.warn(`Received invalid feature key: ${key}`);
      }
    });

    // We pull a single text feature from the TextFeature Text field.
    const text = get(attributeValues, 'textFeature.value', '');
    if (text !== '') {
      features.push(
        Features.createTextFeature({ text, id: attributeValues.textFeature.id })
      );
    }

    // We can also pull multiple text features from the TextFeatures KeyValue field.
    const texts = get(attributeValues, 'textFeatures.value', '');
    if (texts !== '') {
      const keyValueTextFeatures = parseKeyValueAttribute(texts);
      keyValueTextFeatures.forEach(({ value }, i) => {
        features.push(
          Features.createTextFeature({
            text: value,
            id: `${attributeValues.textFeatures.id}-${i}`,
          })
        );
      });
    }

    const scriptures = get(attributeValues, 'scriptureFeatures.value', '');
    if (scriptures !== '') {
      const keyValueTextFeatures = parseKeyValueAttribute(scriptures);
      keyValueTextFeatures.forEach(({ value }, i) => {
        features.push(
          Features.createScriptureFeature({
            reference: value,
            id: `${attributeValues.scriptureFeatures.id}-${i}`,
          })
        );
      });
    }

    return features;
  }

  createSummary = ({ content, summary }) => {
    if (summary) return summary;
    if (!content || typeof content !== 'string') return '';
    // Protect against 0 length sentences (tokenizer will throw an error)
    if (content.split(' ').length === 1) return '';

    const tokenizer = new natural.SentenceTokenizer();
    const tokens = tokenizer.tokenize(
      sanitizeHtmlNode(content, {
        allowedTags: [],
        allowedAttributes: [],
      })
    );
    // protects from starting with up to a three digit number and period
    return tokens.length > 1 && tokens[0].length < 5
      ? `${tokens[0]} ${tokens[1]}`
      : tokens[0];
  };

  getShareUrl = async ({ contentId, channelId }) => {
    const contentChannel = await this.context.dataSources.ContentChannel.getFromId(
      channelId
    );

    if (!contentChannel.itemUrl) return ROCK.SHARE_URL;

    const slug = await this.request('ContentChannelItemSlugs')
      .filter(`ContentChannelItemId eq ${contentId}`)
      .cache({ ttl: 60 })
      .first();

    return [
      ROCK.SHARE_URL,
      contentChannel.itemUrl.replace(/^\//, ''),
      slug ? slug.slug : '',
    ].join('/');
  };

  getSermonFeed() {
    return this.byContentChannelId(ROCK_MAPPINGS.SERMON_CHANNEL_ID).andFilter(
      this.LIVE_CONTENT()
    );
  }

  async isContentActiveLiveStream({ id }) {
    const { LiveStream } = this.context.dataSources;
    const { isLive } = await LiveStream.getLiveStream();
    // if there is no live stream, then there is no live content. Easy enough!
    if (!isLive) return false;

    const mostRecentSermon = await this.getSermonFeed().first();

    // If the most recent sermon is the sermon we are checking, this is the live sermon.
    return mostRecentSermon.id === id;
  }

  async getCoverImage(root) {
    const pickBestImage = (images) => {
      // TODO: there's probably a _much_ more explicit and better way to handle this
      const squareImage = images.find((image) =>
        image.key.toLowerCase().includes('square')
      );
      if (squareImage) return { ...squareImage, __typename: 'ImageMedia' };
      return { ...images[0], __typename: 'ImageMedia' };
    };

    const withSources = (image) => image.sources.length;

    // filter images w/o URLs
    const ourImages = this.getImages(root).filter(withSources);

    if (ourImages.length) return pickBestImage(ourImages);

    // If no image, check parent for image:
    const parentItemsCursor = await this.getCursorByChildContentItemId(root.id);
    if (!parentItemsCursor) return null;

    const parentItems = await parentItemsCursor.get();

    if (parentItems.length) {
      const parentImages = flatten(parentItems.map(this.getImages));
      const validParentImages = parentImages.filter(withSources);

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
      .cache({ ttl: 60 })
      .get();

    if (!associations || !associations.length) return this.request().empty();

    return this.getFromIds(
      associations.map(
        ({ childContentChannelItemId }) => childContentChannelItemId
      )
    ).orderBy('Order');
  };

  getCursorByChildContentItemId = async (id) => {
    const associations = await this.request('ContentChannelItemAssociations')
      .filter(`ChildContentChannelItemId eq ${id}`)
      .cache({ ttl: 60 })
      .get();

    if (!associations || !associations.length) return this.request().empty();
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
      .cache({ ttl: 60 })
      .get();

    if (!parentAssociations || !parentAssociations.length)
      return this.request().empty();

    // Now, fetch all children relations for those parents (excluding the original item)
    const siblingAssociationsRequest = await this.request(
      'ContentChannelItemAssociations'
    );

    const parentFilter = parentAssociations.map(
      ({ contentChannelItemId }) =>
        `(ContentChannelItemId eq ${contentChannelItemId})`
    );
    siblingAssociationsRequest.filterOneOf(parentFilter);

    const siblingAssociations = await siblingAssociationsRequest.get();
    if (!siblingAssociations || !siblingAssociations.length)
      return this.request().empty();

    return this.getFromIds(
      siblingAssociations.map(
        ({ childContentChannelItemId }) => childContentChannelItemId
      )
    ).orderBy('Order');
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

    if (getPersonaGuidsForUser.length === 0) {
      return this.request().empty();
    }

    // Rely on custom code without the plugin.
    // Use plugin, if the user has set USE_PLUGIN to true.
    // In general, you should ALWAYS use the plugin if possible.
    const endpoint = get(ApollosConfig, 'ROCK.USE_PLUGIN', false)
      ? 'Apollos/ContentChannelItemsByDataViewGuids'
      : 'ContentChannelItems/GetFromPersonDataView';

    // Grabs content items based on personas
    return this.request(
      `${endpoint}?guids=${getPersonaGuidsForUser
        .map((obj) => obj.guid)
        .join()}`
    )
      .andFilter(this.LIVE_CONTENT())
      .top(first)
      .orderBy('StartDateTime', 'desc');
  };

  byUserFeed = () => this.byActive().orderBy('StartDateTime', 'desc');

  byActive = () =>
    this.request()
      .filterOneOf(
        ROCK_MAPPINGS.FEED_CONTENT_CHANNEL_IDS.map(
          (id) => `ContentChannelId eq ${id}`
        )
      )
      .cache({ ttl: 60 })
      .andFilter(this.LIVE_CONTENT());

  byContentChannelId = (id) =>
    this.request()
      .filter(`ContentChannelId eq ${id}`)
      .andFilter(this.LIVE_CONTENT())
      .cache({ ttl: 60 })
      .orderBy('StartDateTime', 'desc');

  byContentChannelIds = (ids = []) =>
    this.request()
      .filterOneOf(ids.map((id) => `ContentChannelId eq ${id}`))
      .andFilter(this.LIVE_CONTENT())
      .cache({ ttl: 60 })
      .orderBy('StartDateTime', 'desc');

  getFromIds = (ids = []) => {
    if (ids.length === 0) return this.request().empty();
    if (get(ApollosConfig, 'ROCK.USE_PLUGIN', false)) {
      // Avoids issue when fetching more than ~10 items
      // Caused by an Odata node limit.
      return this.request(
        `Apollos/GetContentChannelItemsByIds?ids=${ids.join(',')}`
      ).andFilter(this.LIVE_CONTENT());
    }
    return this.request()
      .filterOneOf(ids.map((id) => `Id eq ${id}`))
      .andFilter(this.LIVE_CONTENT());
  };

  getFromId = (id) =>
    this.request()
      .find(id)
      .get();

  resolveType({
    attributeValues,
    attributes,
    contentChannelTypeId,
    contentChannelId,
  }) {
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
    // if we have defined a ContentChannelId based maping in the YML file, use it!
    if (
      Object.values(ROCK_MAPPINGS.CONTENT_ITEM).some(
        ({ ContentChannelId }) =>
          ContentChannelId && ContentChannelId.includes(contentChannelId)
      )
    ) {
      return Object.keys(ROCK_MAPPINGS.CONTENT_ITEM).find((key) => {
        const value = ROCK_MAPPINGS.CONTENT_ITEM[key];
        return (
          value.ContentChannelId &&
          value.ContentChannelId.includes(contentChannelId)
        );
      });
    }

    if (this.hasMedia({ attributeValues, attributes })) {
      return 'MediaContentItem';
    }

    return 'UniversalContentItem';
  }
}
