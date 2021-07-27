import { gql } from '@apollo/client';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query getAddCommentFeature($featureId: ID!) {
    node(id: $featureId) {
      ...AddCommentFeatureFragment
    }
    currentUser {
      id
      profile {
        id
        firstName
        lastName
        photo {
          uri
        }
      }
    }
  }
  ${ApollosConfig.FRAGMENTS.ADD_COMMENT_FEATURE_FRAGMENT}
`;
