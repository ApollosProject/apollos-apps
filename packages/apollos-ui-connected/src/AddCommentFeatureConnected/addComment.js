import { gql } from '@apollo/client';
import ApollosConfig from '@apollosproject/config';

export default gql`
  mutation addComment(
    $text: String!
    $parentId: ID!
    $visibility: CommentVisibility
  ) {
    addComment(text: $text, parentId: $parentId, visibility: $visibility) {
      ...CommentFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.COMMENT_FRAGMENT}
`;
