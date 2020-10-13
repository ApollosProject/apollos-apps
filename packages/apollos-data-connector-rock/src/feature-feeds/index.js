import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import { createGlobalId, parseGlobalId } from '@apollosproject/server-core';
import ApollosConfig from '@apollosproject/config';

const resolver = {
  Query: {
    homeFeedFeatures: async (root, args, { dataSources: { FeatureFeed } }) =>
      FeatureFeed.getFeed({ type: 'apollosConfig', args: { section: 'home' } }),
    discoverFeedFeatures: async (
      root,
      args,
      { dataSources: { FeatureFeed } }
    ) =>
      FeatureFeed.getFeed({
        type: 'apollosConfig',
        args: { section: 'discover' },
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
    const { Feature } = this.context.dataSources;

    let config = [];
    if (type === 'apollosConfig' && args.section === 'home')
      config = ApollosConfig.HOME_FEATURES || [];
    else if (type === 'apollosConfig' && args.section === 'discover')
      config = ApollosConfig.DISCOVER_FEATURES || [];

    return {
      __typename: 'FeatureFeed',
      id: createGlobalId(JSON.stringify({ type, args }), 'FeatureFeed'),
      // Defer parsing of feature feed if not requested in gql.
      // Useful if the config comes from the network.
      getFeatures: () => Feature.getFeatures(config),
    };
  };
}

export { resolver, FeatureFeed as dataSource };
