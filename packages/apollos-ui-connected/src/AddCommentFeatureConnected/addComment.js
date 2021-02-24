import { gql } from '@apollo/client';

export default gql`
  mutation addComment($text: String!, $parentId: ID!) {
    addComment(text: $text, parentId: $parentId) {
      id
      text
      person {
        id
        nickName
        photo {
          uri
        }
        campus {
          id
          name
        }
      }
    }
  }
`;
