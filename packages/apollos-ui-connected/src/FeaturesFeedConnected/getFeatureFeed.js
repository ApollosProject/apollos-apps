import ApollosConfig from '@apollosproject/config';
import gql from 'graphql-tag';

export default gql`
  query getFeatureFeed($featureFeedId: ID!) {
    node(id: $featureFeedId) {
      id
      ... on FeatureFeed {
        features {
          ...FeaturesFragment
        }
      }
    }
  }
  ${ApollosConfig.FRAGMENTS.FEATURES_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.TEXT_FEATURE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.SCRIPTURE_FEATURE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.WEBVIEW_FEATURE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.ACTION_LIST_FEATURE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.ACTION_BAR_FEATURE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.HERO_LIST_FEATURE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.HORIZONTAL_CARD_LIST_FEATURE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.VERTICAL_CARD_LIST_FEATURE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.PRAYER_LIST_FEATURE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.RELATED_NODE_FRAGMENT}
`;
