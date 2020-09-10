import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query getContentChildSiblings($nodeId: ID!, $cursor: String) {
    node(id: $nodeId) {
      id
      ... on ContentItem {
        siblingContentItemsConnection(after: $cursor) {
          edges {
            cursor
            node {
              ...contentCardFragment
            }
          }
        }
      }
      ... on ContentChildNode {
        siblingContentItemsConnection(after: $cursor) {
          edges {
            cursor
            node {
              ...contentCardFragment
            }
          }
        }
      }
    }
  }
  ${ApollosConfig.FRAGMENTS.CONTENT_CARD_FRAGMENT}
`;
