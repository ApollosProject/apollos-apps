/* eslint-disable class-methods-use-this */
import Hypher from 'hypher';
import english from 'hyphenation.en-us';
import {
  generateAppLink,
  createCursor,
  parseCursor,
} from '@apollosproject/server-core';
import { Op } from 'sequelize';
import ApollosConfig from '@apollosproject/config';
import { uniq } from 'lodash';
import { PostgresDataSource } from '../postgres';

class ContentItemDataSource extends PostgresDataSource {
  modelName = 'contentItem';

  async hasMedia(model) {
    const videos = await model.getImages();
    const audios = await model.getAudios();
    return [...videos, ...audios].length > 0;
  }

  async paginate({ cursor, where = {}, limit = 20, after, ...args } = {}) {
    let skip = 0;
    if (after) {
      const parsed = parseCursor(after);
      if (parsed && Object.hasOwnProperty.call(parsed, 'position')) {
        skip = parsed.position + 1;
      } else {
        throw new Error(`An invalid 'after' cursor was provided: ${after}`);
      }
    }

    const findFunc =
      cursor?.bind(this) || this.model.findAndCountAll.bind(this.model);

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

  getSermons(...args) {
    return this.getFromCategoryIds(
      ApollosConfig?.CONTENT?.SERMON_CHANNEL_IDS,
      args
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

    const mostRecentSermons = await this.getSermons({ limit: 1 });
    return mostRecentSermons;
  };

  async getCoverImage(model) {
    return model.getCoverImage();
  }

  async getFeatures(model) {
    return model.getFeatures();
  }

  // A simple alias at this point.
  async getParents(model, queryArgs = {}) {
    return model.getParents(queryArgs);
  }

  // A simple alias at this point.
  async getChildren(model, queryArgs = {}) {
    return model.getChildren(queryArgs);
  }

  async getSiblings(model, queryArgs = {}) {
    const parent = await model.getParent();
    if (parent) {
      return parent.getDirectChildren(queryArgs);
    }
    return [];
  }

  // Generates feed based on persons dataview membership
  async getPersonaFeed(args = {}) {
    const {
      dataSources: { Person },
    } = this.context;
    const personId = await Person.getCurrentPersonId();

    return this.model.findAll({
      ...args,
      include: {
        model: this.sequelize.models.tag,
        as: 'tags',
        where: { type: 'Persona' },
        include: {
          model: this.sequelize.models.people,
          where: { id: personId },
          as: 'people',
        },
      },
    });
  }

  getUserFeed = (args = {}) => {
    return this.model.findAll(args);
  };

  getFromCategoryIds = (ids = [], args = {}) => {
    if (ids.some((id) => typeof id === 'number')) {
      console.warn(
        'You are passing rock ids IDS to ContentItem.getFromCategoryIds. This is supported, but we recommend using Postgres IDS in your config.yml long term'
      );
      return this.model.findAll({
        ...args,
        include: [
          {
            model: this.sequelize.models.contentItemCategory,
            where: {
              originId: { [Op.in]: ids.map(String) },
              originType: 'rock',
            },
          },
          ...(args?.include || []),
        ],
      });
    }

    return this.model.findAll({
      ...args,
      where: {
        contentItemCategoryId: { [Op.in]: ids },
        ...args?.where,
      },
      order: [['publish_at', 'DESC']],
    });
  };

  getFromIds = (ids = [], args = {}) => {
    return this.model.findAll({
      ...args,
      where: {
        id: { [Op.in]: ids },
        ...args?.where,
      },
    });
  };

  getFromOriginIds = (ids = [], args = {}) => {
    return this.model.findAll({
      where: {
        originId: { [Op.in]: ids.map(String) },
        ...args?.where,
      },
      ...args,
    });
  };

  async getUpNext(model) {
    const { Auth, Interactions } = this.context.dataSources;

    // Safely exit if we don't have a current user.
    try {
      await Auth.getCurrentPerson();
    } catch (e) {
      return null;
    }

    const childItemsOldestFirst = await model.getChildren({
      order: [['publishAt', 'ASC']],
    });

    const childItems = childItemsOldestFirst.reverse();

    const interactions = await Interactions.getInteractionsForCurrentUserAndNodes(
      {
        nodeIds: childItems.map(({ apollosId }) => apollosId),
        actions: ['COMPLETE'],
      }
    );
    const apollosIdsWithInteractions = interactions.map(
      ({ foreignKey }) => foreignKey
    );

    const firstInteractedIndex = childItems.findIndex(({ apollosId }) =>
      apollosIdsWithInteractions.includes(apollosId)
    );

    if (firstInteractedIndex === -1) {
      // If you haven't completede anything, return the first (last in reversed array) item;
      return childItems[childItems.length - 1];
    }
    if (firstInteractedIndex === 0) {
      // If you have completed the last item, return null (no items left to read)
      return null;
    }
    // otherwise, return the item immediately following (before) the item you have already read
    return childItems[firstInteractedIndex - 1];
  }

  async getSeriesWithUserProgress() {
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

    const ids = uniq(interactions.map(({ foreignKey }) => foreignKey));

    const inProgressItems = (
      await Promise.all(
        ids.map(async (id) => {
          const model = await this.model.findOne({ where: { apollosId: id } });
          return {
            model,
            percent: await this.getPercentComplete(model),
          };
        })
      )
    ).filter(
      ({ percent, model }) => percent !== 100 && percent != null && model
    );

    return inProgressItems.map(({ model }) => model);
  }

  async getPercentComplete(model) {
    const { Auth, Interactions } = this.context.dataSources;
    // This can, and should, be cached in redis or some other system at some point

    // Safely exit if we don't have a current user.
    try {
      await Auth.getCurrentPerson();
    } catch (e) {
      return null;
    }

    if (!model) {
      return null;
    }

    const childItems = await model.getChildren();

    if (childItems.length === 0) {
      return 0;
    }

    const interactions = await Interactions.getInteractionsForCurrentUserAndNodes(
      {
        nodeIds: childItems.map(({ apollosId }) => apollosId),
        actions: ['COMPLETE'],
      }
    );

    const apollosIdsWithInteractions = interactions.map(
      ({ foreignKey }) => foreignKey
    );

    const totalItemsWithInteractions = childItems.filter(({ apollosId }) =>
      apollosIdsWithInteractions.includes(apollosId)
    ).length;

    return (totalItemsWithInteractions / childItems.length) * 100;
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

export { ContentItemDataSource as default };
