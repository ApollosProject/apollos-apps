import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import { createGlobalId } from '@apollosproject/server-core';
import ApollosConfig from '@apollosproject/config';

const resolver = {
  Query: {
    homeFeedFeatures: async (root, args, { dataSources: { FeatureFeed } }) =>
      FeatureFeed.getFeed({
        type: 'apollosConfig',
        args: { section: 'HOME_FEATURES' },
      }),
    discoverFeedFeatures: async (
      root,
      args,
      { dataSources: { FeatureFeed } }
    ) =>
      FeatureFeed.getFeed({
        type: 'apollosConfig',
        args: { section: 'DISCOVER_FEATURES' },
      }),
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

  getFeed = ({ type = '', args = {} }) => {
    let getFeatures = () => [];
    const { Feature } = this.context.dataSources;

    if (type === 'apollosConfig') {
      getFeatures = () =>
        Feature.getFeatures(ApollosConfig[args.section] || []);
    }

    return {
      __typename: 'FeatureFeed',
      id: createGlobalId(JSON.stringify({ type, args }), 'FeatureFeed'),
      getFeatures,
    };
  };
}

export { resolver, FeatureFeed as dataSource };
