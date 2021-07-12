import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query GetActionTableFeature($featureId: ID!) {
    node(id: $featureId) {
      ...ActionTableFeatureFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.ACTION_TABLE_FEATURE_FRAGMENT}
  # Following fragment nested inside the ActionlistFeature
  ${ApollosConfig.FRAGMENTS.RELATED_NODE_FRAGMENT}
`;
