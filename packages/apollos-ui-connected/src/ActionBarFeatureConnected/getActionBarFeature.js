import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query getActionBarFeature($featureId: ID!) {
    node(id: $featureId) {
      ...ActionBarFeatureFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.ACTION_BAR_FEATURE_FRAGMENT}
  # Following fragment nested inside the ActionlistFeature
  ${ApollosConfig.FRAGMENTS.RELATED_NODE_FRAGMENT}
`;
