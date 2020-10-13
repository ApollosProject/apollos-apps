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

  getApollosConfigFeatures(args) {
    if (ApollosConfig[args.section]) {
      return this.context.dataSources.Feature.getFeatures(
        ApollosConfig[args.section]
      );
    }
    return [];
  }

  getFeed = ({ type = '', args = {} }) => {
    let getFeatures;

    if (type === 'apollosConfig') {
      getFeatures = this.getApollosConfigFeatures.bind(this);
    }

    return {
      __typename: 'FeatureFeed',
      id: createGlobalId(JSON.stringify({ type, args }), 'FeatureFeed'),
      // Defer parsing of feature feed if not requested in gql.
      // Useful if the config comes from the network.
      getFeatures: () => getFeatures(args),
    };
  };
}

export { resolver, FeatureFeed as dataSource };
