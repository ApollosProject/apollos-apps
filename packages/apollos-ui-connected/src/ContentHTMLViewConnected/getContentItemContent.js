import { gql } from '@apollo/client';

export default gql`
  query getContentItemHTML($contentId: ID!) {
    node(id: $contentId) {
      ... on ContentItem {
        id
        htmlContent
      }
    }
  }
`;
