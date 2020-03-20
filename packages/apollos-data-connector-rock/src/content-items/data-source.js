import { get } from 'lodash';
import RockApolloDataSource, {
  parseKeyValueAttribute,
} from '@apollosproject/rock-apollo-data-source';
import ApollosConfig from '@apollosproject/config';
import moment from 'moment-timezone';
import natural from 'natural';
import sanitizeHtmlNode from 'sanitize-html';
import { createGlobalId } from '@apollosproject/server-core';

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
    // TODO this should be written in a more extendable way for partners
    const genericFeatures = get(attributeValues, 'features.value', '');
    const keyValuePairs = parseKeyValueAttribute(genericFeatures);
    keyValuePairs.forEach(({ key, value }, i) => {
      const [type, modifier] = key.split('/');
      switch (type) {
        case 'scripture':
          features.push(
            Features.createScriptureFeature({
              reference: value,
              version: modifier,
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

  createSummary = ({ content, attributeValues }) => {
    const summary = get(attributeValues, 'summary.value', '');
    if (summary !== '') return summary;
    if (!content || typeof content !== 'string') return '';
    // Protect against 0 length sentences (tokenizer will throw an error)
    if (content.split(' ').length === 1) return '';

    const tokenizer = new natural.SentenceTokenizer();
    const tokens = tokenizer.tokenize(
      sanitizeHtmlNode(content, {
        allowedTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        allowedAttributes: [],
        exclusiveFilter: (frame) => frame.tag.match(/^(h1|h2|h3|h4|h5|h6)$/),
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
    const liveContent = await this.getActiveLiveStreamContent();
    return liveContent.map((c) => c.id).includes(id);
  }

  // having this as a method instead of a property will cause issues in the
  // data-connector-church-online package.
  getActiveLiveStreamContent = async () => {
    const { LiveStream } = this.context.dataSources;
    const { isLive } = await LiveStream.getLiveStream();
    // if there is no live stream, then there is no live content. Easy enough!
    if (!isLive) return [];

    const mostRecentSermon = await this.getSermonFeed().first();
    return [mostRecentSermon];
  };

  // eslint-disable-next-line class-methods-use-this
  pickBestImage({ images }) {
    // TODO: there's probably a _much_ more explicit and better way to handle this
    const squareImage = images.find((image) =>
      image.key.toLowerCase().includes('square')
    );
    if (squareImage) return { ...squareImage, __typename: 'ImageMedia' };
    return { ...images[0], __typename: 'ImageMedia' };
  }

  async getCoverImage(root) {
    const { Cache } = this.context.dataSources;
    const cachedValue = await Cache.get({
      key: `contentItem:coverImage:${root.id}`,
    });

    if (cachedValue) {
      return cachedValue;
    }

    let image = null;

    // filter images w/o URLs
    const ourImages = this.getImages(root).filter(
      ({ sources }) => sources.length
    );

    if (ourImages.length) {
      image = this.pickBestImage({ images: ourImages });
    }

    // If no image, check parent for image:
    if (!image) {
      // The cursor returns a promise which returns a promisee, hence th edouble eawait.
      const parentItems = await (await this.getCursorByChildContentItemId(
        root.id
      )).get();

      if (parentItems.length) {
        const validParentImages = parentItems
          .flatMap(this.getImages)
          .filter(({ sources }) => sources.length);

        if (validParentImages && validParentImages.length)
          image = this.pickBestImage({ images: validParentImages });
      }
    }

    if (image != null) {
      Cache.set({ key: `contentItem:coverImage:${root.id}`, data: image });
    }

    return image;
  }

  LIVE_CONTENT = () => {
    // get a date in the local timezone of the rock instance.
    // will create a timezone formatted string and then strip off the offset
    // should output something like 2019-03-27T12:27:20 which means 12:27pm in New York
    const date = moment()
      .tz(ROCK.TIMEZONE)
      .format()
      .split(/[-+]\d+:\d+/)[0];
    const filter = `(((StartDateTime lt datetime'${date}') or (StartDateTime eq null)) and ((ExpireDateTime gt datetime'${date}') or (ExpireDateTime eq null))) and (((Status eq 'Approved') or (ContentChannel/RequiresApproval eq false)))`;
    return get(ROCK, 'SHOW_INACTIVE_CONTENT', false) ? null : filter;
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

    return this.getFromIds(
      associations.map(({ contentChannelItemId }) => contentChannelItemId)
    ).orderBy('Order');
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

  byUserFeed = () =>
    this.byActive()
      .orderBy('StartDateTime', 'desc')
      .expand('ContentChannel');

  byActive = () =>
    this.request()
      .filterOneOf(
        ROCK_MAPPINGS.FEED_CONTENT_CHANNEL_IDS.map(
          (id) => `ContentChannelId eq ${id}`
        )
      )
      .cache({ ttl: 60 })
      .andFilter(this.LIVE_CONTENT());

  byDateAndActive = async ({ datetime }) =>
    this.request()
      .filterOneOf(
        ROCK_MAPPINGS.FEED_CONTENT_CHANNEL_IDS.map(
          (id) => `ContentChannelId eq ${id}`
        )
      )
      .cache({ ttl: 60 })
      .andFilter(
        `(CreatedDateTime gt datetime'${datetime}') or (ModifiedDateTime gt datetime'${datetime}')`
      )
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

  async getUpNext({ id }) {
    const { Auth, Interactions } = this.context.dataSources;

    // Safely exit if we don't have a current user.
    try {
      await Auth.getCurrentPerson();
    } catch (e) {
      return null;
    }

    const childItemsCursor = await this.getCursorByParentContentItemId(id);
    const childItems = await childItemsCursor
      .orderBy()
      .sort([
        { field: 'Order', direction: 'desc' },
        { field: 'StartDateTime', direction: 'desc' },
      ])
      .get();

    // Returns the item _after_ the most recent item you have interacted with.
    let lastItem = null;
    for (let i = 0; i < childItems.length; i += 1) {
      const item = childItems[i];
      // This implementation is extremly niave.
      // The non niave version of this implementation, however, has an extremly likelyhood to breakdown
      // and throw errors when working with more than 25 items. Further solutions will need to be done
      // on the rock level.
      // eslint-disable-next-line no-await-in-loop
      const interactions = await Interactions.getNodeInteractionsForCurrentUser(
        {
          nodeId: createGlobalId(item.id, this.resolveType(item)),
          actions: ['COMPLETE'],
        }
      );
      if (interactions.length !== 0) {
        return lastItem;
      }
      lastItem = item;
    }
    return lastItem;
  }

  async getPercentComplete({ id }) {
    const { Auth, Interactions } = this.context.dataSources;

    // Safely exit if we don't have a current user.
    try {
      await Auth.getCurrentPerson();
    } catch (e) {
      return null;
    }

    const childItemsCursor = await this.getCursorByParentContentItemId(id);
    const childItems = await childItemsCursor.get();

    if (childItems.length === 0) {
      return 0;
    }

    const itemsWithInteractions = (await Promise.all(
      childItems.map(async (item) => {
        const interaction = await Interactions.getNodeInteractionsForCurrentUser(
          {
            nodeId: createGlobalId(item.id, this.resolveType(item)),
            actions: ['COMPLETE'],
          }
        );

        if (interaction.length > 0) {
          return item;
        }
        return null;
      })
    )).filter((item) => item);
    return (itemsWithInteractions.length / childItems.length) * 100;
  }

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
