import { flatten, get } from 'lodash';
import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import ApollosConfig from '@apollosproject/config';

class ActionAlgorithm extends RockApolloDataSource {
  // Names of Action Algoritms mapping to the functions that create the actions.
  ACTION_ALGORITHMS = Object.entries({
    // We need to make sure `this` refers to the class, not the `ACTION_ALGORITHIMS` object.
    PERSONA_FEED: this.personaFeedAlgorithm,
    CONTENT_CHANNEL: this.contentChannelAlgorithm,
    SERMON_CHILDREN: this.sermonChildrenAlgorithm,
    LATEST_SERIES_CHILDREN: this.latestSeriesChildrenAlgorithm,
    UPCOMING_EVENTS: this.upcomingEventsAlgorithm,
    CAMPAIGN_ITEMS: this.campaignItemsAlgorithm,
    SERIES_IN_PROGRESS: this.seriesInProgressAlgorithm,
    USER_FEED: this.userFeedAlgorithm,
    DAILY_PRAYER: this.dailyPrayerAlgorithm,
  }).reduce((accum, [key, value]) => {
    // convenciance code to make sure all methods are bound to the Features dataSource
    // eslint-disable-next-line
    accum[key] = value.bind(this);
    return accum;
  }, {});

  async runAlgorithms({ algorithms, args }) {
    const { Feature } = this.context.dataSources;
    // We should flatten just in case a single algorithm generates multiple actions
    return flatten(
      await Promise.all(
        algorithms.map(async (algorithm) => {
          const featureAlgorithims = Feature.ACTION_ALGORITHIMS || {};
          // Lookup the algorithm function, based on the name, and run it.
          if (typeof algorithm === 'object') {
            // NOTE this is in for backwards compatibility
            // should remove reference to Feature.ACTION_ALGORITHIMS eventually
            if (featureAlgorithims[algorithm.type]) {
              console.warn(
                'Please move action algorithms from Feature to ActionAlgorithm data source.'
              );
              return featureAlgorithims[algorithm.type]({
                ...algorithm.arguments,
                ...args,
              });
            }

            return this.ACTION_ALGORITHMS[algorithm.type]({
              ...algorithm.arguments,
              ...args,
            });
          }
          // NOTE this is in for backwards compatibility
          // should remove reference to Feature.ACTION_ALGORITHIMS eventually
          // return this.ACTION_ALGORITHMS[algorithm]();
          const allAlgos = {
            ...this.ACTION_ALGORITHMS,
            ...featureAlgorithims,
          };
          return allAlgos[algorithm](args);
        })
      )
    );
  }

  async dailyPrayerAlgorithm({
    limit = 10,
    numberDaysSincePrayer,
    primaryAliasId,
  } = {}) {
    const { PrayerRequest, Feature } = this.context.dataSources;
    Feature.setCacheHint({ maxAge: 0, scope: 'PRIVATE' });
    const cursor = await PrayerRequest.byDailyPrayerFeed({
      numberDaysSincePrayer,
      primaryAliasId,
    });
    return cursor.top(limit).get();
  }

  // Gets the first 3 upcoming events
  async upcomingEventsAlgorithm() {
    const { Event } = this.context.dataSources;

    // Get the first three persona items.
    const events = await Event.findRecent().top(3).get();
    // Map them into specific actions.
    return events.map((event, i) => ({
      id: `${event.id}${i}`,
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
    const { ContentItem, Feature } = this.context.dataSources;
    Feature.setCacheHint({ maxAge: 0, scope: 'PRIVATE' });

    // Get the first three persona items.
    const personaFeed = await ContentItem.byPersonaFeed(3);
    const items = await personaFeed.expand('ContentChannel').get();

    // Map them into specific actions.
    return items.map((item, i) => ({
      id: `${item.id}${i}`,
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
      id: `${item.id}${i}`,
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

    const cursor = (
      await ContentItem.getCursorByParentContentItemId(sermon.id)
    ).expand('ContentChannel');
    const items = limit ? await cursor.top(limit).get() : await cursor.get();

    return items.map((item, i) => ({
      id: `${item.id}${i}`,
      title: item.title,
      subtitle: get(item, 'contentChannel.name'),
      relatedNode: { ...item, __type: ContentItem.resolveType(item) },
      image: ContentItem.getCoverImage(item),
      action: 'READ_CONTENT',
      summary: ContentItem.createSummary(item),
    }));
  }

  async latestSeriesChildrenAlgorithm({ limit = null, channelId } = {}) {
    const { ContentItem } = this.context.dataSources;

    if (!channelId) return console.warn('Must provide channelId') || [];
    const series = await ContentItem.byContentChannelId(channelId)
      .andFilter(ContentItem.LIVE_CONTENT())
      .first();
    if (!series) return [];

    const cursor = (
      await ContentItem.getCursorByParentContentItemId(series.id)
    ).expand('ContentChannel');
    const items = limit ? await cursor.top(limit).get() : await cursor.get();

    return items.map((item, i) => ({
      id: `${item.id}${i}`,
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
      id: `${item.id}${i}`,
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

    const items = await ContentItem.byUserFeed().top(limit).get();

    return items.map((item, i) => ({
      id: `${item.id}${i}`,
      title: item.title,
      subtitle: get(item, 'contentChannel.name'),
      relatedNode: { ...item, __type: ContentItem.resolveType(item) },
      image: ContentItem.getCoverImage(item),
      action: 'READ_CONTENT',
      summary: ContentItem.createSummary(item),
    }));
  }

  async seriesInProgressAlgorithm({ limit = 3, channelIds = [] } = {}) {
    const { ContentItem, Feature } = this.context.dataSources;
    Feature.setCacheHint({ maxAge: 0, scope: 'PRIVATE' });

    const items = await (
      await ContentItem.getSeriesWithUserProgress({
        channelIds,
      })
    )
      .expand('ContentChannel')
      .top(limit)
      .get();

    return items.map((item, i) => ({
      id: `${item.id}${i}`,
      title: item.title,
      subtitle: get(item, 'contentChannel.name'),
      relatedNode: { ...item, __type: ContentItem.resolveType(item) },
      image: ContentItem.getCoverImage(item),
      action: 'READ_CONTENT',
      summary: ContentItem.createSummary(item),
    }));
  }
}

export { ActionAlgorithm as dataSource };
