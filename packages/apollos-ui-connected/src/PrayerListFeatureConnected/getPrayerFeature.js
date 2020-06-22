import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query getActionListFeature($featureId: ID!) {
    node(id: $featureId) {
      ...PrayerListFeatureFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.PRAYER_LIST_FEATURE_FRAGMENT}
`;
