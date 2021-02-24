import gql from 'graphql-tag';
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
        photo {
          uri
        }
      }
    }
  }
  ${ApollosConfig.FRAGMENTS.ADD_COMMENT_FEATURE_FRAGMENT}
`;
