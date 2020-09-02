import gql from 'graphql-tag';

export default gql`
  query getContentNode($nodeId: ID!) {
    node(id: $nodeId) {
      id
      ... on ContentNode {
        title
        htmlContent
        coverImage {
          sources {
            uri
          }
        }
      }
    }
  }
`;
