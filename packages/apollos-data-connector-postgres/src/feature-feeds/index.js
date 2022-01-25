import { createGlobalId } from '@apollosproject/server-core';

const resolver = {
  Query: {
    tabFeedFeatures: (root, args, { dataSources: { FeatureFeed } }) =>
      FeatureFeed.getFeed({
        type: 'tab',
        args,
      }),
    homeFeedFeatures: (root, args, { dataSources: { FeatureFeed } }) =>
      FeatureFeed.getFeed({
        type: 'apollosConfig',
        args: { section: 'HOME_FEATURES', ...args },
      }),
    discoverFeedFeatures: (root, args, { dataSources: { FeatureFeed } }) =>
      FeatureFeed.getFeed({
        type: 'apollosConfig',
        args: { section: 'DISCOVER_FEATURES' },
      }),
  },
  WeekendContentItem: {
    featureFeed: ({ id }, args, { dataSources: { FeatureFeed } }) =>
      FeatureFeed.getFeed({ type: 'contentItem', args: { id } }),
  },
  DevotionalContentItem: {
    featureFeed: ({ id }, args, { dataSources: { FeatureFeed } }) =>
      FeatureFeed.getFeed({ type: 'contentItem', args: { id } }),
  },
  ContentSeriesContentItem: {
    featureFeed: ({ id }, args, { dataSources: { FeatureFeed } }) =>
      FeatureFeed.getFeed({ type: 'contentItem', args: { id } }),
  },
  UniversalContentItem: {
    featureFeed: ({ id }, args, { dataSources: { FeatureFeed } }) =>
      FeatureFeed.getFeed({ type: 'contentItem', args: { id } }),
  },
  MediaContentItem: {
    featureFeed: ({ id }, args, { dataSources: { FeatureFeed } }) =>
      FeatureFeed.getFeed({ type: 'contentItem', args: { id } }),
  },
};

class FeatureFeed {
  initialize(config) {
    this.context = config.context;
  }

  getFromId = (id) => this.getFeed(JSON.parse(id));

  getFeed = async ({ type = '', args = {}, features }) => {
    let getFeatures = () => [];
    const { Feature, ContentItem, Config } = this.context.dataSources;

    if (features) {
      getFeatures = () => Feature.getFeatures(features);
    } else {
      // TODO deprecated
      if (type === 'tab') {
        getFeatures = () =>
          Feature.getFeatures(Config.TABS[args.tab] || [], args);
      }

      // TODO deprecated
      if (type === 'apollosConfig') {
        getFeatures = () =>
          Feature.getFeatures(Config[args.section] || [], args);
      }

      if (type === 'contentItem' && args.id) {
        const contentItem = await ContentItem.getFromId(args.id);
        getFeatures = () => ContentItem.getFeatures(contentItem);
      }
    }

    return {
      __typename: 'FeatureFeed',
      id: createGlobalId(JSON.stringify({ type, args }), 'FeatureFeed'),
      // lazy-loaded
      features: getFeatures,
    };
  };
}

export { resolver, FeatureFeed as dataSource };
