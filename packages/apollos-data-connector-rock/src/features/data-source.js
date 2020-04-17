import { flatten, get } from 'lodash';
import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import { createGlobalId } from '@apollosproject/server-core';
import ApollosConfig from '@apollosproject/config';

export default class Feature extends RockApolloDataSource {
  resource = '';

  // Names of Action Algoritms mapping to the functions that create the actions.
  ACTION_ALGORITHIMS = {
    // We need to make sure `this` refers to the class, not the `ACTION_ALGORITHIMS` object.
    PERSONA_FEED: this.personaFeedAlgorithm.bind(this),
    CONTENT_CHANNEL: this.contentChannelAlgorithm.bind(this),
    SERMON_CHILDREN: this.sermonChildrenAlgorithm.bind(this),
    UPCOMING_EVENTS: this.upcomingEventsAlgorithm.bind(this),
    CAMPAIGN_ITEMS: this.campaignItemsAlgorithm.bind(this),
    USER_FEED: this.userFeedAlgorithm.bind(this),
  };

  getFromId(args, id) {
    const type = id.split(':')[0];
    const funcArgs = JSON.parse(args);
    const method = this[`create${type}`].bind(this);
    return method(funcArgs);
  }

  // eslint-disable-next-line class-methods-use-this
  createFeatureId({ args, type }) {
    return createGlobalId(JSON.stringify(args), type);
  }

  async runAlgorithms({ algorithms }) {
    // We should flatten just in case a single algorithm generates multiple actions
    return flatten(
      await Promise.all(
        algorithms.map(async (algorithm) => {
          // Lookup the algorithm function, based on the name, and run it.
          if (typeof algorithm === 'object') {
            return this.ACTION_ALGORITHIMS[algorithm.type](algorithm.arguments);
          }
          return this.ACTION_ALGORITHIMS[algorithm]();
        })
      )
    );
  }

  async createActionListFeature({ algorithms = [], title, subtitle }) {
    // Generate a list of actions.
    const actions = () => this.runAlgorithms({ algorithms });
    return {
      // The Feature ID is based on all of the action ids, added together.
      // This is naive, and could be improved.
      id: this.createFeatureId({
        type: 'ActionListFeature',
        args: {
          algorithms,
          title,
          subtitle,
        },
      }),
      actions,
      title,
      subtitle,
      // Typanme is required so GQL knows specifically what Feature is being created
      __typename: 'ActionListFeature',
    };
  }

  async createVerticalCardListFeature({
    algorithms = [],
    title,
    subtitle,
    isFeatured = false,
  }) {
    // Generate a list of cards.
    const cards = () => this.runAlgorithms({ algorithms });
    return {
      // The Feature ID is based on all of the action ids, added together.
      // This is naive, and could be improved.
      id: this.createFeatureId({
        type: 'VerticalCardListFeature',
        args: {
          algorithms,
          title,
          subtitle,
          isFeatured,
        },
      }),
      cards,
      isFeatured,
      title,
      subtitle,
      // Typename is required so GQL knows specifically what Feature is being created
      __typename: 'VerticalCardListFeature',
    };
  }

  async createHorizontalCardListFeature({
    algorithms = [],
    hyphenatedTitle,
    title,
    subtitle,
  }) {
    // Generate a list of horizontal cards.
    const cards = () => this.runAlgorithms({ algorithms });
    return {
      // The Feature ID is based on all of the action ids, added together.
      // This is naive, and could be improved.
      id: this.createFeatureId({
        type: 'HorizontalCardListFeature',
        args: {
          algorithms,
          title,
          subtitle,
        },
      }),
      cards,
      hyphenatedTitle,
      title,
      subtitle,
      // Typename is required so GQL knows specifically what Feature is being created
      __typename: 'HorizontalCardListFeature',
    };
  }

  // eslint-disable-next-line class-methods-use-this
  createTextFeature({ text, id }) {
    return {
      body: text,
      id: createGlobalId(id, 'TextFeature'),
      __typename: 'TextFeature',
    };
  }

  // eslint-disable-next-line class-methods-use-this
  createScriptureFeature({ reference, version, id }) {
    return {
      reference,
      version,
      id: createGlobalId(id, 'ScriptureFeature'),
      __typename: 'ScriptureFeature',
    };
  }

  // Gets the first 3 upcoming events
  async upcomingEventsAlgorithm() {
    const { Event } = this.context.dataSources;

    // Get the first three persona items.
    const events = await Event.findRecent()
      .top(3)
      .get();
    // Map them into specific actions.
    return events.map((event, i) => ({
      id: createGlobalId(`${event.id}${i}`, 'ActionListAction'),
      title: Event.getName(event),
      subtitle: Event.getDateTime(event.schedule).start,
      relatedNode: { ...event, __type: 'Event' },
      image: Event.getImage(event),
      action: 'READ_EVENT',
      summary: '',
    }));
  }

  // Gets the first 3 items for a user, based on their personas.
  async personaFeedAlgorithm() {
    const { ContentItem } = this.context.dataSources;

    // Get the first three persona items.
    const personaFeed = await ContentItem.byPersonaFeed(3);
    const items = await personaFeed.expand('ContentChannel').get();

    // Map them into specific actions.
    return items.map((item, i) => ({
      id: createGlobalId(`${item.id}${i}`, 'ActionListAction'),
      title: item.title,
      subtitle: get(item, 'contentChannel.name'),
      relatedNode: { ...item, __type: ContentItem.resolveType(item) },
      image: ContentItem.getCoverImage(item),
      action: 'READ_CONTENT',
      summary: ContentItem.createSummary(item),
    }));
  }

  // Gets a configurable amount of content items from a specific content channel.
  async contentChannelAlgorithm({ contentChannelId, limit = null } = {}) {
    if (contentChannelId == null) {
      throw new Error(
        `contentChannelId is a required argument for the CONTENT_CHANNEL ActionList algorithm.
Make sure you structure your algorithm entry as \`{ type: 'CONTENT_CHANNEL', aruments: { contentChannelId: 13 } }\``
      );
    }

    const { ContentItem } = this.context.dataSources;
    const cursor = ContentItem.byContentChannelId(contentChannelId).expand(
      'ContentChannel'
    );

    const items = limit ? await cursor.top(limit).get() : await cursor.get();

    return items.map((item, i) => ({
      id: createGlobalId(`${item.id}${i}`, 'ActionListAction'),
      title: item.title,
      subtitle: get(item, 'contentChannel.name'),
      relatedNode: { ...item, __type: ContentItem.resolveType(item) },
      image: ContentItem.getCoverImage(item),
      action: 'READ_CONTENT',
      summary: ContentItem.createSummary(item),
    }));
  }

  // Gets a configurable amount of content items that are a child of the most recent sermon.
  async sermonChildrenAlgorithm({ limit = null } = {}) {
    const { ContentItem } = this.context.dataSources;

    const sermon = await ContentItem.getSermonFeed().first();
    if (!sermon) {
      return [];
    }

    const cursor = (await ContentItem.getCursorByParentContentItemId(
      sermon.id
    )).expand('ContentChannel');
    const items = limit ? await cursor.top(limit).get() : await cursor.get();

    return items.map((item, i) => ({
      id: createGlobalId(`${item.id}${i}`, 'ActionListAction'),
      title: item.title,
      subtitle: get(item, 'contentChannel.name'),
      relatedNode: { ...item, __type: ContentItem.resolveType(item) },
      image: ContentItem.getCoverImage(item),
      action: 'READ_CONTENT',
      summary: ContentItem.createSummary(item),
    }));
  }

  // Gets a configurable amount of content items from each of the configured campaigns
  async campaignItemsAlgorithm({ limit = 1 } = {}) {
    const { ContentItem } = this.context.dataSources;

    const channels = await ContentItem.byContentChannelIds(
      ApollosConfig.ROCK_MAPPINGS.CAMPAIGN_CHANNEL_IDS
    ).get();

    const items = flatten(
      await Promise.all(
        channels.map(async ({ id, title }) => {
          const childItemsCursor = await ContentItem.getCursorByParentContentItemId(
            id
          );

          const childItems = await childItemsCursor
            .top(limit)
            .expand('ContentChannel')
            .get();

          return childItems.map((item) => ({
            ...item,
            channelSubtitle: title,
          }));
        })
      )
    );

    return items.map((item, i) => ({
      id: createGlobalId(`${item.id}${i}`, 'ActionListAction'),
      title: item.title,
      subtitle: get(item, 'contentChannel.name'),
      relatedNode: { ...item, __type: ContentItem.resolveType(item) },
      image: ContentItem.getCoverImage(item),
      action: 'READ_CONTENT',
      summary: ContentItem.createSummary(item),
    }));
  }

  async userFeedAlgorithm({ limit = 20 } = {}) {
    const { ContentItem } = this.context.dataSources;

    const items = await ContentItem.byUserFeed()
      .top(limit)
      .get();

    return items.map((item, i) => ({
      id: createGlobalId(`${item.id}${i}`, 'ActionListAction'),
      title: item.title,
      subtitle: get(item, 'contentChannel.name'),
      relatedNode: { ...item, __type: ContentItem.resolveType(item) },
      image: ContentItem.getCoverImage(item),
      action: 'READ_CONTENT',
      summary: ContentItem.createSummary(item),
    }));
  }

  async getScriptureShareMessage(ref) {
    const { Scripture } = this.context.dataSources;
    const scriptures = await Scripture.getScriptures(ref);
    return scriptures
      .map(
        ({ content, reference }) =>
          `${content.replace(/<[^>]*>?/gm, '')} ${reference}`
      )
      .join('\n\n');
  }

  async getHomeFeedFeatures() {
    return Promise.all(
      get(ApollosConfig, 'HOME_FEATURES', []).map((featureConfig) => {
        switch (featureConfig.type) {
          case 'VerticalCardList':
            return this.createVerticalCardListFeature(featureConfig);
          case 'HorizontalCardList':
            return this.createHorizontalCardListFeature(featureConfig);
          case 'ActionList':
          default:
            // Action list was the default in 1.3.0 and prior.
            return this.createActionListFeature(featureConfig);
        }
      })
    );
  }
}
