import gql from 'graphql-tag';

export default gql`
  query nodeFeatures($nodeId: ID!) {
    node(id: $nodeId) {
      id
      ... on FeaturesNode {
        featureFeed {
          id
        }
      }
    }
  }
`;
