import { gql } from '@apollo/client';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query GetVerticalPrayerListFeature($featureId: ID!) {
    node(id: $featureId) {
      ...VerticalPrayerListFeatureFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.VERTICAL_PRAYER_LIST_FEATURE_FRAGMENT}
`;
