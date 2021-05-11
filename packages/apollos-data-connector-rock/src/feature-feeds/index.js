import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import { createGlobalId } from '@apollosproject/server-core';
import ApollosConfig from '@apollosproject/config';

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
  FeatureFeed: {
    // lazy-loaded
    features: ({ getFeatures }) => getFeatures(),
  },
};

class FeatureFeed extends RockApolloDataSource {
  getFromId = (id) => {
    return this.getFeed(JSON.parse(id));
  };

  getFeed = async ({ type = '', args = {} }) => {
    let getFeatures = () => [];
    const { Feature, ContentItem } = this.context.dataSources;

    if (type === 'tab') {
      getFeatures = () =>
        Feature.getFeatures(ApollosConfig.TABS[args.tab] || [], args);
    }

    // TODO deprecated
    if (type === 'apollosConfig') {
      getFeatures = () =>
        Feature.getFeatures(ApollosConfig[args.section] || [], args);
    }

    if (type === 'contentItem' && args.id) {
      const contentItem = await ContentItem.getFromId(args.id);
      getFeatures = () => ContentItem.getFeatures(contentItem);
    }

    return {
      __typename: 'FeatureFeed',
      id: createGlobalId(JSON.stringify({ type, args }), 'FeatureFeed'),
      getFeatures,
    };
  };
}

export { resolver, FeatureFeed as dataSource };
