import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query getCommentListFeature($featureId: ID!) {
    node(id: $featureId) {
      ...CommentListFeatureFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.COMMENT_LIST_FEATURE_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.COMMENT_FRAGMENT}
`;
