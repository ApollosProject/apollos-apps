import Hypher from 'hypher';
import english from 'hyphenation.en-us';
import {
  createGlobalId,
  parseGlobalId,
  generateAppLink,
  createCursor,
  parseCursor,
} from '@apollosproject/server-core';
import { Op } from 'sequelize';
import ApollosConfig from '@apollosproject/config';
import { PostgresDataSource } from '../postgres';

const { ROCK, ROCK_MAPPINGS } = ApollosConfig;

class ContentItemDataSource extends PostgresDataSource {
  modelName = 'contentItem';

  activeChannelIds =
    ROCK_MAPPINGS.ALL_CONTENT_CHANNELS ||
    // TODO deprecated variables
    ROCK_MAPPINGS.ACTIVE_CONTENT_CHANNEL_IDS ||
    ROCK_MAPPINGS.FEED_CONTENT_CHANNEL_IDS;

  // hasMedia = ({ attributeValues, attributes }) =>
  //   Object.keys(attributes).filter((key) =>
  //     this.attributeIsVideo({
  //       key,
  //       attributeValues,
  //       attributes,
  //     })
  //   ).length ||
  //   Object.keys(attributes).filter((key) =>
  //     this.attributeIsAudio({
  //       key,
  //       attributeValues,
  //       attributes,
  //     })
  //   ).length;

  //   async getFeatures(item) {
  //     const { attributeValues, id } = item;
  //     const { Feature } = this.context.dataSources;
  //     const features = [];
  //
  //
  //   }

  async paginate({ cursor, where = {}, limit = 20, after, ...args }) {
    let skip = 0;
    if (after) {
      const parsed = parseCursor(after);
      if (parsed && Object.hasOwnProperty.call(parsed, 'position')) {
        skip = parsed.position + 1;
      } else {
        throw new Error(`An invalid 'after' cursor was provided: ${after}`);
      }
    }

    const findFunc = cursor || this.model.findAndCountAll.bind(this.model);

    const result = await findFunc({
      where,
      ...args,
      offset: skip,
      limit,
    });

    let getTotalCount;
    let rows;

    // If the cursor returned a straight up array
    // For example, if `getAll` was called.
    if (Array.isArray(result)) {
      rows = result;
      // solve this later.....
      getTotalCount = () => 0;
    } else {
      // If the cursor was a `findAndCountAll`
      getTotalCount = () => result.count;
      rows = result.rows;
    }

    return {
      edges: rows.map((node, i) => ({
        node,
        cursor: createCursor({ position: i + skip }),
      })),
      getTotalCount,
    };
  }

  getShareUrl = async (content) => {
    return generateAppLink('universal', 'content', {
      contentID: content.apollosId,
    });
  };

  getSermonFeed() {
    // return this.byContentChannelId(ROCK_MAPPINGS.SERMON_CHANNEL_ID).andFilter(
    //   this.LIVE_CONTENT()
    // );
  }

  async isContentActiveLiveStream({ id }) {
    // const liveContent = await this.getActiveLiveStreamContent();
    // return liveContent.map((c) => c.id).includes(id);
  }

  // having this as a method instead of a property will cause issues in the
  // data-connector-church-online package.
  getActiveLiveStreamContent = async () => {
    //     const { LiveStream } = this.context.dataSources;
    //     const { isLive } = await LiveStream.getLiveStream();
    //     // if there is no live stream, then there is no live content. Easy enough!
    //     if (!isLive) return [];
    //
    //     const mostRecentSermon = await this.getSermonFeed().first();
    //     return [mostRecentSermon];
  };

  async getCoverImage(root) {}

  expanded = true;

  // A simple alias at this point.
  async getParents(model) {
    return model.getParents();
  }

  getCursorByParentContentItemId = async (model) => {
    return {
      cursor: this.model.getChildren,
    };
  };

  // A simple alias at this point.
  async getChildren(model) {
    return model.getChildren();
  }

  getCursorByChildContentItemId = async (id) => {};

  async getSiblings(model) {
    // get parent (single)
    // get parents children
  }

  getCursorBySiblingContentItemId = async (id) => {};

  // Generates feed based on persons dataview membership
  byPersonaFeed = async (first) => {
    //     const {
    //       dataSources: { Persona },
    //     } = this.context;
    //
    //     // Grabs the guids associated with all dataviews user is memeber
    //     const getPersonaGuidsForUser = await Persona.getPersonas({
    //       categoryId: ROCK_MAPPINGS.DATAVIEW_CATEGORIES.PersonaId,
    //     });
    //
    //     if (getPersonaGuidsForUser.length === 0) {
    //       return this.request().empty();
    //     }
    //
    //     // Rely on custom code without the plugin.
    //     // Use plugin, if the user has set USE_PLUGIN to true.
    //     // In general, you should ALWAYS use the plugin if possible.
    //     const endpoint = get(ApollosConfig, 'ROCK.USE_PLUGIN', false)
    //       ? 'Apollos/ContentChannelItemsByDataViewGuids'
    //       : 'ContentChannelItems/GetFromPersonDataView';
    //
    //     // Grabs content items based on personas
    //     return this.request(
    //       `${endpoint}?guids=${getPersonaGuidsForUser
    //         .map((obj) => obj.guid)
    //         .join()}`
    //     )
    //       .andFilter(this.LIVE_CONTENT())
    //       .top(first)
    //       .orderBy('StartDateTime', 'desc');
  };

  getUserFeed = () => {
    return this.model.findAll();
  };

  getActive = () => {
    return this.model.findAll();
  };
  // this.request()
  // .filterOneOf(
  //   this.activeChannelIds.map((id) => `ContentChannelId eq ${id}`)
  // )
  // .cache({ ttl: 60 })
  // .andFilter(this.LIVE_CONTENT());

  getDateAndActive = async ({ datetime }) => {
    return this.model.findAll({
      where: {
        [Op.or]: [
          {
            createdAt: {
              [Op.gt]: datetime,
            },
          },
          {
            updatedAt: {
              [Op.gt]: datetime,
            },
          },
        ],
      },
    });
  };
  // this.request()
  //   .filterOneOf(
  //     this.activeChannelIds.map((id) => `ContentChannelId eq ${id}`)
  //   )
  //   .cache({ ttl: 60 })
  //   .andFilter(
  //     `(CreatedDateTime gt datetime'${datetime}') or (ModifiedDateTime gt datetime'${datetime}')`
  //   )
  //   .andFilter(this.LIVE_CONTENT());

  byContentChannelId = (id) => {
    return this.model.findAll();
  };
  // this.request()
  //   .filter(`ContentChannelId eq ${id}`)
  //   .andFilter(this.LIVE_CONTENT())
  //   .cache({ ttl: 60 })
  //   .orderBy('StartDateTime', 'desc');

  byContentChannelIds = (ids = []) => {
    return this.model.findAll();
  };
  // this.request()
  //   .filterOneOf(ids.map((id) => `ContentChannelId eq ${id}`))
  //   .andFilter(this.LIVE_CONTENT())
  //   .cache({ ttl: 60 })
  //   .orderBy('StartDateTime', 'desc');

  getFromIds = (ids = [], { originType = null } = {}) => {
    return this.model.findAll({
      where: {},
    });
    // if (ids.length === 0) return this.request().empty();
    // if (get(ApollosConfig, 'ROCK.USE_PLUGIN', false)) {
    //   // Avoids issue when fetching more than ~10 items
    //   // Caused by an Odata node limit.
    //   return this.request(
    //     `Apollos/GetContentChannelItemsByIds?ids=${ids.join(',')}`
    //   ).andFilter(this.LIVE_CONTENT());
    // }
    // return this.request()
    //   .filterOneOf(ids.map((id) => `Id eq ${id}`))
    //   .andFilter(this.LIVE_CONTENT());
  };

  async getUpNext({ id }) {
    //     const { Auth, Interactions } = this.context.dataSources;
    //
    //     // Safely exit if we don't have a current user.
    //     try {
    //       await Auth.getCurrentPerson();
    //     } catch (e) {
    //       return null;
    //     }
    //
    //     const childItemsCursor = await this.getCursorByParentContentItemId(id);
    //     const childItemsOldestFirst = await childItemsCursor
    //       .orderBy()
    //       .sort(this.DEFAULT_SORT())
    //       .get();
    //
    //     const childItems = childItemsOldestFirst.reverse();
    //     const childItemsWithApollosIds = childItems.map((childItem) => ({
    //       ...childItem,
    //       apollosId: createGlobalId(childItem.id, this.resolveType(childItem)),
    //     }));
    //
    //     const interactions = await Interactions.getInteractionsForCurrentUserAndNodes(
    //       {
    //         nodeIds: childItemsWithApollosIds.map(({ apollosId }) => apollosId),
    //         actions: ['COMPLETE'],
    //       }
    //     );
    //     const apollosIdsWithInteractions = interactions.map(
    //       ({ foreignKey }) => foreignKey
    //     );
    //
    //     const firstInteractedIndex = childItemsWithApollosIds.findIndex(
    //       ({ apollosId }) => apollosIdsWithInteractions.includes(apollosId)
    //     );
    //
    //     if (firstInteractedIndex === -1) {
    //       // If you haven't completede anything, return the first (last in reversed array) item;
    //       return childItemsWithApollosIds[childItemsWithApollosIds.length - 1];
    //     }
    //     if (firstInteractedIndex === 0) {
    //       // If you have completed the last item, return null (no items left to read)
    //       return null;
    //     }
    //     // otherwise, return the item immediately following (before) the item you have already read
    //     return childItemsWithApollosIds[firstInteractedIndex - 1];
  }

  async getSeriesWithUserProgress({ channelIds = [] } = {}) {
    //     const { Auth, Interactions } = this.context.dataSources;
    //
    //     // Safely exit if we don't have a current user.
    //     try {
    //       await Auth.getCurrentPerson();
    //     } catch (e) {
    //       return this.request().empty();
    //     }
    //
    //     const interactions = await Interactions.getInteractionsForCurrentUser({
    //       actions: ['SERIES_START'],
    //     });
    //
    //     const ids = uniq(
    //       interactions.map(({ foreignKey }) => {
    //         const { id } = parseGlobalId(foreignKey);
    //         return id;
    //       })
    //     );
    //
    //     const completedIds = (
    //       await Promise.all(
    //         ids.map(async (id) => ({
    //           id,
    //           percent: await this.getPercentComplete({ id }),
    //         }))
    //       )
    //     )
    //       .filter(({ percent }) => percent === 100)
    //       .map(({ id }) => id);
    //
    //     const inProgressIds = ids.filter((id) => ![...completedIds].includes(id));
    //     let cursor = this.getFromIds(inProgressIds);
    //
    //     // only search through allowed channels
    //     channelIds.forEach((id) => {
    //       cursor = cursor.andFilter(`ContentChannelId eq ${id}`);
    //     });
    //
    //     // exclude campaign channels
    //     ROCK_MAPPINGS.CAMPAIGN_CHANNEL_IDS.forEach((id) => {
    //       cursor = cursor.andFilter(`ContentChannelId ne ${id}`);
    //     });
    //
    //     return cursor;
  }

  async getPercentComplete({ id }) {
    //     const { Auth, Interactions } = this.context.dataSources;
    //     // This can, and should, be cached in redis or some other system at some point
    //
    //     // Safely exit if we don't have a current user.
    //     try {
    //       await Auth.getCurrentPerson();
    //     } catch (e) {
    //       return null;
    //     }
    //
    //     const childItemsCursor = await this.getCursorByParentContentItemId(id);
    //     const childItems = await childItemsCursor.get();
    //
    //     if (childItems.length === 0) {
    //       return 0;
    //     }
    //
    //     const childItemsWithApollosIds = childItems.map((childItem) => ({
    //       ...childItem,
    //       apollosId: createGlobalId(childItem.id, this.resolveType(childItem)),
    //     }));
    //
    //     const interactions = await Interactions.getInteractionsForCurrentUserAndNodes(
    //       {
    //         nodeIds: childItemsWithApollosIds.map(({ apollosId }) => apollosId),
    //         actions: ['COMPLETE'],
    //       }
    //     );
    //
    //     const apollosIdsWithInteractions = interactions.map(
    //       ({ foreignKey }) => foreignKey
    //     );
    //
    //     const totalItemsWithInteractions = childItemsWithApollosIds.filter(
    //       ({ apollosId }) => apollosIdsWithInteractions.includes(apollosId)
    //     ).length;
    //
    //     return (totalItemsWithInteractions / childItems.length) * 100;
  }

  getFromId = (id) => this.request().find(id).get();

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

export { ContentItemDataSource as default };
