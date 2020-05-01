import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query getHeroListFeature($featureId: ID!) {
    node(id: $featureId) {
      ...HeroListFeatureFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.HERO_LIST_FEATURE_FRAGMENT}
`;
