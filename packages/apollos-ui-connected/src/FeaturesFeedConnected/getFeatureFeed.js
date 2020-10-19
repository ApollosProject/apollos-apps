import ApollosConfig from '@apollosproject/config';
import gql from 'graphql-tag';

export default gql`
  query getFeatureFeed($featureFeedId: ID!) {
    node(id: $featureFeedId) {
      id
      ... on FeatureFeed {
        features {
          ...FeedFeaturesFragment
        }
      }
    }
  }
  ${ApollosConfig.FRAGMENTS.FEED_FEATURES_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.TEXT_FEATURE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.SCRIPTURE_FEATURE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.WEBVIEW_FEATURE_FRAGMENT}
`;
