/* eslint-disable class-methods-use-this */
import { flatten, get } from 'lodash';
import { PostgresDataSource } from '../postgres';

class ActionAlgorithm extends PostgresDataSource {
  // Names of Action Algorithms mapping to the functions that create the actions.
  ACTION_ALGORITHMS = Object.entries({
    // We need to make sure `this` refers to the class, not the `ACTION_ALGORITHMS` object.
    CONTENT_FEED: this.contentFeedAlgorithm,
    PERSONA_FEED: this.personaFeedAlgorithm,
    //
    // TODO deprecate these two
    CONTENT_CHANNEL: this.contentChannelAlgorithm,
    USER_FEED: this.userFeedAlgorithm,
    CAMPAIGN_ITEMS: this.campaignItemsAlgorithm,
    //
    //
    SERMON_CHILDREN: this.sermonChildrenAlgorithm,
    LATEST_SERIES_CHILDREN: this.latestSeriesChildrenAlgorithm,
    UPCOMING_EVENTS: this.upcomingEventsAlgorithm,
    SERIES_IN_PROGRESS: this.seriesInProgressAlgorithm,
    DAILY_PRAYER: this.dailyPrayerAlgorithm,
    CHILDREN_OF_PARENTS_BY_CATEGORIES: this
      .childrenOfParentsByCategoriesAlgoritm,
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
    personId,
  } = {}) {
    const { PrayerRequest, Feature } = this.context.dataSources;
    Feature.setCacheHint({ maxAge: 0, scope: 'PRIVATE' });

    return PrayerRequest.byDailyPrayerFeed({
      numberDaysSincePrayer,
      personId,
      limit,
    });
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
      action: 'READ_CONTENT',
      summary: '',
    }));
  }

  // Gets the first 3 items for a user, based on their personas.
  async personaFeedAlgorithm({ limit = 3 } = {}) {
    const { ContentItem, Feature } = this.context.dataSources;
    Feature.setCacheHint({ maxAge: 0, scope: 'PRIVATE' });

    // Get the first three persona items.
    const items = await ContentItem.getPersonaFeed({ limit });

    // Map them into specific actions.
    return items.map((item, i) => ({
      id: `${item.id}${i}`,
      title: item.title,
      subtitle: get(item, 'contentChannel.name'),
      relatedNode: item,
      image: item.getCoverImage(),
      action: 'READ_CONTENT',
      summary: item.summary,
    }));
  }

  // TODO deprecate, use CONTENT_FEED
  // Gets a configurable amount of content items from a specific content channel.
  async contentChannelAlgorithm() {
    console.warn('CONTENT_CHANNEL algorithm is deprecated, use CONTENT_FEED');
    console.warn('Using this algorithm now throws an error.');
    throw new Error(
      'CONTENT_CHANNEL algorithm is deprecated, use CONTENT_FEED'
    );
  }

  // Gets a configurable amount of content items that are a child of the most recent sermon.
  async sermonChildrenAlgorithm({ limit = null } = {}) {
    const { ContentItem } = this.context.dataSources;

    const sermons = await ContentItem.getSermons({ limit: 1 });
    if (sermons.length === 0) {
      return [];
    }
    const sermon = sermons[0];

    const items = await sermon.getChildren({ limit });

    return items.map((item, i) => ({
      id: `${item.id}${i}`,
      title: item.title,
      subtitle: get(item, 'contentChannel.name'),
      relatedNode: item,
      image: item.getCoverImage(),
      action: 'READ_CONTENT',
      summary: item.summary,
    }));
  }

  async latestSeriesChildrenAlgorithm({ limit = null, channelId } = {}) {
    const { ContentItem } = this.context.dataSources;

    if (!channelId) return console.warn('Must provide channelId') || [];
    const seriesList = await ContentItem.getFromCategoryIds([channelId], {
      limit: 1,
    });
    if (!seriesList.length === 0) return [];

    const series = seriesList[0];

    const items = await series.getChildren({ limit });

    return items.map((item, i) => ({
      id: `${item.id}${i}`,
      title: item.title,
      subtitle: get(item, 'contentChannel.name'),
      relatedNode: item,
      image: item.getCoverImage(),
      action: 'READ_CONTENT',
      summary: item.summary,
    }));
  }

  // Gets a configurable amount of content items from each of the configured campaigns
  async campaignItemsAlgorithm({ channelIds = [], limit = 1 } = {}) {
    console.warn('CAMPAIGN_ITEMS has been renamed');
    console.warn('Use CHILDREN_OF_PARENTS_BY_CATEGORY instead');
    return this.childrenOfParentsByCategoriesAlgoritm({
      categoryIds: channelIds,
      limit,
    });
  }

  async childrenOfParentsByCategoriesAlgoritm({
    categoryIds = [],
    limit = 1,
  } = {}) {
    const { ContentItem } = this.context.dataSources;

    const campaignList = await ContentItem.getFromCategoryIds(categoryIds, {
      limit: 1,
    });

    const items = flatten(
      await Promise.all(
        campaignList.map(async (campaign) => campaign.getChildren({ limit }))
      )
    );

    return items.map((item, i) => ({
      id: `${item.id}${i}`,
      title: item.title,
      subtitle: get(item, 'contentChannel.name'),
      relatedNode: { ...item, __type: item.apollosType },
      image: item.getCoverImage(),
      action: 'READ_CONTENT',
      summary: item.summary,
    }));
  }

  async contentFeedAlgorithm({ channelIds = [], limit = 20, skip = 0 } = {}) {
    const { ContentItem } = this.context.dataSources;

    const items = await ContentItem.getFromCategoryIds(channelIds, {
      limit,
      skip,
    });

    return items.map((item, i) => ({
      id: `${item.id}${i}`,
      title: item.title,
      subtitle: get(item, 'contentChannel.name'),
      relatedNode: item,
      image: item.getCoverImage(),
      action: 'READ_CONTENT',
      summary: item.summary,
    }));
  }

  // TODO deprecate, use CONTENT_FEED instead
  async userFeedAlgorithm() {
    console.warn('USER_FEED algorithm is deprecated, use CONTENT_FEED');
    console.warn('Using this algorithm now throws an error.');
    throw new Error('USER_FEED algorithm is deprecated, use CONTENT_FEED');
  }

  async seriesInProgressAlgorithm({
    limit = 3,
    channelIds = [],
    emptyMessage = 'All caught up!',
  } = {}) {
    const { ContentItem, Feature } = this.context.dataSources;
    Feature.setCacheHint({ maxAge: 0, scope: 'PRIVATE' });

    const items = await ContentItem.getSeriesWithUserProgress(
      {
        categoryIds: channelIds,
      },
      { limit }
    );

    return items.length
      ? items.map((item, i) => ({
          id: `${item.id}${i}`,
          title: item.title,
          subtitle: get(item, 'contentChannel.name'),
          relatedNode: item,
          image: item.getCoverImage(),
          action: 'READ_CONTENT',
          summary: item.summary,
        }))
      : [
          {
            id: 'EmptyCard',
            relatedNode: {
              // __type: 'Message',
              __typename: 'Message',
              message: emptyMessage,
            },
          },
        ];
  }
}

export const resolver = {};

export { ActionAlgorithm as dataSource };
