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
    const {
      id: { type, args },
    } = parseGlobalId(id);
    return this.getFeed({ type, args });
  };

  getFeed = ({ type = '', args = {} }) => {
    let config = [];
    if (type === 'apollosConfig' && args.section === 'home')
      config = ApollosConfig.HOME_FEATURES || [];
    else if (type === 'apollosConfig' && args.section === 'discover')
      config = ApollosConfig.DISCOVER_FEATURES || [];

    return {
      __typename: 'FeatureFeed',
      id: createGlobalId({ type, args }, 'FeatureFeed'),
      getFeatures: () => this.getFeatures(config),
    };
  };
}

export default { resolver, dataSource: FeatureFeed };
