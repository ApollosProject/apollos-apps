import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query getContentSeries($nodeId: ID!, $cursor: String) {
    node(id: $nodeId) {
      id
      ... on ContentItem {
        childContentItemsConnection(after: $cursor) {
          edges {
            cursor
            node {
              ...contentCardFragment
            }
          }
        }
      }
      ... on ContentParentNode {
        childContentItemsConnection(after: $cursor) {
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
