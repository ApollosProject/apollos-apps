import ApollosConfig from '@apollosproject/config';
import { gql } from '@apollo/client';

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
