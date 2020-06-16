import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query getHorizontalCardListFeature($featureId: ID!) {
    node(id: $featureId) {
      ...HorizontalCardListFeatureFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.HORIZONTAL_CARD_LIST_FEATURE_FRAGMENT}
  # Following fragment nested inside the HorizontalCardList
  ${ApollosConfig.FRAGMENTS.RELATED_NODE_FRAGMENT}
`;
