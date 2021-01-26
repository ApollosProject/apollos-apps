import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query getUserPrayersFeature($featureId: ID!) {
    node(id: $featureId) {
      ...UserPrayersFeatureFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.USER_PRAYERS_FEATURE_FRAGMENT}
`;
