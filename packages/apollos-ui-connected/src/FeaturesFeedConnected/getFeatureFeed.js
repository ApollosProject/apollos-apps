import ApollosConfig from '@apollosproject/config';
import gql from 'graphql-tag';

export default gql`
  query getFeatureFeed($featureFeedId: ID!) {
    node(id: $featureFeedId) {
      id
      ... on FeatureFeed {
        features {
          ...LiteFeaturesFragment
        }
      }
    }
  }
  ${ApollosConfig.FRAGMENTS.LITE_FEATURES_FRAGMENT}
`;
