import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query getVerticalCardListFeature($featureId: ID!) {
    node(id: $featureId) {
      ...VerticalCardListFeatureFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.VERTICAL_CARD_LIST_FEATURE_FRAGMENT}
`;
