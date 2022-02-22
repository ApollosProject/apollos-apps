/* eslint-disable class-methods-use-this, no-console */
import Hypher from 'hypher';
import english from 'hyphenation.en-us';
import {
  generateAppLink,
  createCursor,
  parseCursor,
} from '@apollosproject/server-core';
import { Sequelize, Op } from 'sequelize';
import { PostgresDataSource } from '../postgres';
import { activeFilter } from './model';

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

  getShareUrl = async (content) =>
    generateAppLink(
      'universal',
      'content',
      {
        contentID: content.apollosId,
      },
      this.context.dataSources.Config
    );

  getSermons(queryArgs) {
    return this.getFromCategoryIds(
      this.context.dataSources.Config.CONTENT?.SERMON_CHANNEL_IDS,
      queryArgs
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

  async getFeatures(model) {
    return model.getFeatures({
      order: [['priority', 'ASC']],
    });
  }

  // A simple alias at this point.
  async getParents(model, queryArgs = {}) {
    return model.getParents(queryArgs);
  }

  // A simple alias at this point.
  async getChildren(model, queryArgs = {}) {
    return model.getChildren({
      order: [
        // Sequelize doesn't support sorting on the join table any other way.
        // https://github.com/sequelize/sequelize/issues/3173
        [Sequelize.literal('"contentItemsConnection".order'), 'ASC'],
        ['publishAt', 'ASC'],
      ],
      where: { ...activeFilter, ...queryArgs?.where },
      ...queryArgs,
    });
  }

  async getSiblings(model, queryArgs = {}) {
    const parent = await model.getParent();
    if (parent) {
      return this.getChildren(parent, {
        // Calling `getChildren` ensures we have access to the ordering on the join table.
        // We have to spread in activeFilter, b/c it doesn't work in hasManyThrough relationships
        ...queryArgs,
        where: { parentId: parent.id, ...activeFilter, ...queryArgs?.where },
      });
    }
    return [];
  }

  // Generates feed based on persons dataview membership
  async getPersonaFeed(args = {}) {
    const {
      dataSources: { Person },
    } = this.context;
    const personId = await Person.getCurrentPersonId();

    return this.sequelize.query(
      `
    SELECT content_item.*, count(tag.id) as tag_count, count(people_tag.tag_id) as people_tag_count 
    FROM content_item
      LEFT OUTER JOIN content_tag ON content_tag.content_item_id = content_item.id
      LEFT OUTER JOIN tag ON content_tag.tag_id = tag.id AND tag.type = 'Persona'
      LEFT OUTER JOIN people_tag ON tag.id = people_tag.tag_id and people_tag.person_id = :personId
    WHERE
      content_item.active = true
      ${
        args.categoryIDs?.length > 0
          ? `AND content_item.content_item_category_id IN(:categoryIds)`
          : ''
      }
      AND (
        content_item.publish_at IS NULL or content_item.publish_at < now()
      )
      AND (
        content_item.expire_at IS NULL OR content_item.expire_at > now()
      )
    GROUP BY content_item.id
    HAVING ((count(tag.id) > 0 and count(people_tag.tag_id) > 0) OR (count(tag.id) = 0))
    ORDER BY count(people_tag.tag_id) DESC, publish_at DESC
    LIMIT :limit
    OFFSET :offset;    
    `,
      {
        replacements: {
          personId,
          categoryIds: args.categoryIDs || [],
          limit: args.limit || 20,
          offset: args.offset || 0,
        },
        model: this.sequelize.models.contentItem,
        mapToModel: true,
      }
    );
  }

  getUserFeed = (args = {}) => this.model.findAll(args);

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
      order: [['publishAt', 'DESC']],
    });
  };

  getFromIds = (ids = [], args = {}) =>
    this.model.findAll({
      ...args,
      where: {
        id: { [Op.in]: ids },
        ...args?.where,
      },
    });

  getFromOriginIds = (ids = [], args = {}) =>
    this.model.findAll({
      where: {
        originId: { [Op.in]: ids.map(String) },
        ...args?.where,
      },
      ...args,
    });

  async getUpNext(model) {
    const { Person } = this.context.dataSources;

    // Safely exit if we don't have a current user.
    let currentPersonId;

    try {
      currentPersonId = await Person.getCurrentPersonId();
    } catch (e) {
      return null;
    }

    const childItemsByOldestPublishDate = await this.getChildren(model, {
      include: [
        {
          model: this.sequelize.models.interaction,
          where: {
            personId: currentPersonId,
            action: 'COMPLETE',
          },
          required: false,
        },
      ],
    });

    const childItems = childItemsByOldestPublishDate.reverse();

    const lastItemInteractedIndex = childItems.findIndex(
      (contentItem) => contentItem.interactions.length > 0
    );

    // If no item in the series has been interacted with
    if (lastItemInteractedIndex === -1) {
      // return the oldest item in the series
      return childItems[childItems.length - 1];
    }

    // If the last item in the series has been interacted with
    if (lastItemInteractedIndex === 0) {
      return null;
    }
    // return the item before the last interacted index
    return childItems[lastItemInteractedIndex - 1];
  }

  async getSeriesWithUserProgress({ categoryIds = [] }) {
    const { Person } = this.context.dataSources;

    const currentPersonId = await Person.getCurrentPersonId();

    const inProgressItems = await this.sequelize.query(
      `
      SELECT content_item.*
      FROM
         content_item 
         INNER JOIN
            (
               SELECT
                  count(children_with_interactions.id) AS total_children_interactions,
                  content_item.id,
                  total_children.count AS total_children_count,
                  children_with_interactions.person_id
               FROM
                  content_item 
                  INNER JOIN
                     (
                        SELECT
                           content_item.*,
                           interaction.id AS interaction_id,
                           interaction.person_id
                        FROM
                           content_item 
                           LEFT JOIN
                              interaction 
                              ON node_id = content_item.id 
                        WHERE
                           parent_id IS NOT NULL
                           AND active = true
                           AND publish_at < now()
                           AND (
                             expire_at IS NULL OR expire_at > now()
                           )
                           AND interaction.person_id = :personId
                           AND interaction.id IS NOT NULL
                     )
                     AS children_with_interactions 
                     ON content_item.id = children_with_interactions.parent_id 
                  INNER JOIN
                     (
                        SELECT
                           Count(id),
                           parent_id 
                        FROM
                           content_item 
                        WHERE
                           parent_id IS NOT NULL
                           AND active = true
                           AND publish_at < now()
                           AND (
                             expire_at IS NULL OR expire_at > now()
                           )
                        GROUP BY
                           content_item.parent_id
                     )
                     AS total_children 
                     ON total_children.parent_id = content_item.id 
               GROUP BY
                  content_item.id,
                  total_children.count,
                  children_with_interactions.person_id
            )
            AS parents_with_counts 
            ON parents_with_counts.id = content_item.id 
      WHERE
         content_item.active = true
         ${
           categoryIds.length > 0
             ? `AND content_item.content_item_category_id IN(:categoryIds)`
             : ''
         }
         AND content_item.publish_at < now()
         AND (
            content_item.expire_at IS NULL OR content_item.expire_at > now()
         )   
         AND total_children_interactions != total_children_count;
         
    `,
      {
        replacements: {
          personId: currentPersonId,
          categoryIds,
        },
        model: this.sequelize.models.contentItem,
        mapToModel: true,
      }
    );

    return inProgressItems;
  }

  async getPercentComplete(model) {
    const { Person } = this.context.dataSources;

    // Safely exit if we don't have a current user.
    let currentPersonId;

    try {
      currentPersonId = await Person.getCurrentPersonId();
    } catch (e) {
      return null;
    }

    if (!model) {
      return null;
    }

    const childItems = await this.getChildren(model, {
      include: [
        {
          model: this.sequelize.models.interaction,
          where: {
            personId: currentPersonId,
            action: 'COMPLETE',
          },
          required: false,
        },
      ],
    });

    if (childItems.length === 0) {
      return 0;
    }

    const childItemsWithInteractions = childItems.filter(
      ({ interactions }) => interactions.length > 0
    );

    return (childItemsWithInteractions.length / childItems.length) * 100;
  }

  async getContentItemTags() {
    const tags = await this.sequelize.models.tag.findAll({
      attributes: ['name'],
      where: {
        type: 'ContentItem',
      },
      order: [['name', 'ASC']],
    });

    return tags.map(({ name }) => name);
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
