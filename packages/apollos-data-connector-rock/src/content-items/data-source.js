import { get, uniq } from 'lodash';
import moment from 'moment-timezone';
import natural from 'natural';
import sanitizeHtmlNode from 'sanitize-html';
import Hypher from 'hypher';
import english from 'hyphenation.en-us';

import RockApolloDataSource, {
  parseKeyValueAttribute,
} from '@apollosproject/rock-apollo-data-source';
import ApollosConfig from '@apollosproject/config';
import { createGlobalId, parseGlobalId } from '@apollosproject/server-core';

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

  getFeatures(item) {
    const { attributeValues, id } = item;
    const { Feature } = this.context.dataSources;
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
            Feature.createScriptureFeature({
              reference: value,
              version: modifier,
              id: `${attributeValues.features.id}-${i}`,
            })
          );
          break;
        case 'text':
          features.push(
            Feature.createTextFeature({
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
        Feature.createTextFeature({ text, id: attributeValues.textFeature.id })
      );
    }

    // We can also pull multiple text features from the TextFeatures KeyValue field.
    const texts = get(attributeValues, 'textFeatures.value', '');
    if (texts !== '') {
      const keyValueTextFeatures = parseKeyValueAttribute(texts);
      keyValueTextFeatures.forEach(({ value }, i) => {
        features.push(
          Feature.createTextFeature({
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
          Feature.createScriptureFeature({
            reference: value,
            id: `${attributeValues.scriptureFeatures.id}-${i}`,
          })
        );
      });
    }

    const commentFeatures = get(attributeValues, 'comments.value', 'False');
    if (commentFeatures === 'True') {
      const nodeType = item.__type || this.resolveType(item);
      features.push(
        Feature.createAddCommentFeature({
          nodeId: id,
          nodeType,
          relatedNode: item,
          initialPrompt: this.getAddCommentInitialPrompt(attributeValues),
          addPrompt: this.getAddCommentAddPrompt(attributeValues),
        }),
        Feature.createCommentListFeature({ nodeId: id, nodeType })
      );
    }

    return features;
  }

  getAddCommentInitialPrompt = (attributeValues) => {
    return get(attributeValues, 'initialPrompt.value', 'Write Something...');
  };

  getAddCommentAddPrompt = (attributeValues) => {
    return get(attributeValues, 'addPrompt.value', 'What stands out to you?');
  };

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
      const parentItems = await (
        await this.getCursorByChildContentItemId(root.id)
      ).get();

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

  DEFAULT_SORT = () => [
    { field: 'Order', direction: 'asc' },
    { field: 'StartDateTime', direction: 'asc' },
  ];

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
    ).sort(this.DEFAULT_SORT());
  };

  getCursorByChildContentItemId = async (id) => {
    const associations = await this.request('ContentChannelItemAssociations')
      .filter(`ChildContentChannelItemId eq ${id}`)
      .cache({ ttl: 60 })
      .get();

    if (!associations || !associations.length) return this.request().empty();

    return this.getFromIds(
      associations.map(({ contentChannelItemId }) => contentChannelItemId)
    ).sort(this.DEFAULT_SORT());
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
    ).sort(this.DEFAULT_SORT());
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
    this.byActive().orderBy('StartDateTime', 'desc').expand('ContentChannel');

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
    const childItemsOldestFirst = await childItemsCursor
      .orderBy()
      .sort(this.DEFAULT_SORT())
      .get();

    const childItems = childItemsOldestFirst.reverse();
    const childItemsWithApollosIds = childItems.map((childItem) => ({
      ...childItem,
      apollosId: createGlobalId(childItem.id, this.resolveType(childItem)),
    }));

    const interactions = await Interactions.getInteractionsForCurrentUserAndNodes(
      {
        nodeIds: childItemsWithApollosIds.map(({ apollosId }) => apollosId),
        actions: ['COMPLETE'],
      }
    );
    const apollosIdsWithInteractions = interactions.map(
      ({ foreignKey }) => foreignKey
    );

    const firstInteractedIndex = childItemsWithApollosIds.findIndex(
      ({ apollosId }) => apollosIdsWithInteractions.includes(apollosId)
    );

    if (firstInteractedIndex === -1) {
      // If you haven't completede anything, return the first (last in reversed array) item;
      return childItemsWithApollosIds[childItemsWithApollosIds.length - 1];
    }
    if (firstInteractedIndex === 0) {
      // If you have completed the last item, return null (no items left to read)
      return null;
    }
    // otherwise, return the item immediately following (before) the item you have already read
    return childItemsWithApollosIds[firstInteractedIndex - 1];
  }

  async getSeriesWithUserProgress({ channelIds = [] } = {}) {
    const { Auth, Interactions } = this.context.dataSources;

    // Safely exit if we don't have a current user.
    try {
      await Auth.getCurrentPerson();
    } catch (e) {
      return this.request().empty();
    }

    const interactions = await Interactions.getInteractionsForCurrentUser({
      actions: ['SERIES_START'],
    });

    const ids = uniq(
      interactions.map(({ foreignKey }) => {
        const { id } = parseGlobalId(foreignKey);
        return id;
      })
    );

    const completedIds = (
      await Promise.all(
        ids.map(async (id) => ({
          id,
          percent: await this.getPercentComplete({ id }),
        }))
      )
    )
      .filter(({ percent }) => percent === 100)
      .map(({ id }) => id);

    const inProgressIds = ids.filter((id) => ![...completedIds].includes(id));
    let cursor = this.getFromIds(inProgressIds);

    // only search through allowed channels
    channelIds.forEach((id) => {
      cursor = cursor.andFilter(`ContentChannelId eq ${id}`);
    });

    // exclude campaign channels
    ROCK_MAPPINGS.CAMPAIGN_CHANNEL_IDS.forEach((id) => {
      cursor = cursor.andFilter(`ContentChannelId ne ${id}`);
    });

    return cursor;
  }

  async getPercentComplete({ id }) {
    const { Auth, Interactions } = this.context.dataSources;
    // This can, and should, be cached in redis or some other system at some point

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

    const childItemsWithApollosIds = childItems.map((childItem) => ({
      ...childItem,
      apollosId: createGlobalId(childItem.id, this.resolveType(childItem)),
    }));

    const interactions = await Interactions.getInteractionsForCurrentUserAndNodes(
      {
        nodeIds: childItemsWithApollosIds.map(({ apollosId }) => apollosId),
        actions: ['COMPLETE'],
      }
    );

    const apollosIdsWithInteractions = interactions.map(
      ({ foreignKey }) => foreignKey
    );

    const totalItemsWithInteractions = childItemsWithApollosIds.filter(
      ({ apollosId }) => apollosIdsWithInteractions.includes(apollosId)
    ).length;

    return (totalItemsWithInteractions / childItems.length) * 100;
  }

  getFromId = (id) => this.request().find(id).get();

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

  // eslint-disable-next-line class-methods-use-this
  createHyphenatedString({ text }) {
    const hypher = new Hypher(english);
    const words = text.split(' ');

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
      word.length > 7 ? `${word}\u00AD${segment}` : word + segment;

    const hyphenateLongWords = (word, hyphenateFunction) =>
      word.length > 7 ? hyphenateFunction(word) : word;

    return words
      .map((w) =>
        hyphenateLongWords(w, () =>
          hypher.hyphenate(w).reduce(hyphenateEndOfWord)
        )
      )
      .join(' ');
  }
}
