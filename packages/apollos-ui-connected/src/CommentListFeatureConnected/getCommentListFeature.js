import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query getCommentListFeature($featureId: ID!) {
    node(id: $featureId) {
      ...CommentListFeatureFragment
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
  ${ApollosConfig.FRAGMENTS.COMMENT_LIST_FEATURE_FRAGMENT}
`;
