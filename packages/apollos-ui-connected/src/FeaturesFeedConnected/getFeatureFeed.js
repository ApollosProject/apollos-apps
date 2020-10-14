import ApollosConfig from '@apollosproject/config';
import gql from 'graphql-tag';

export default gql`
  query getFeatureFeed($nodeId: ID!) {
    node(id: $nodeId) {
      ... on FeatureFeed {
        features {
          ...FeedFeaturesFragment
        }
      }
    }
  }
  ${ApollosConfig.FRAGMENTS.FEED_FEATURES_FRAGMENT}
`;
