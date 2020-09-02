import gql from 'graphql-tag';
// import ApollosConfig from '@apollosproject/config';

export default gql`
  query getNodeMedia($nodeId: ID!) {
    node(id: $nodeId) {
      id
      ... on VideoNode {
        videos {
          sources {
            uri
          }
        }
      }
      ... on ContentMedia {
        coverImage {
          sources {
            uri
          }
        }
      }
    }
  }
`;
