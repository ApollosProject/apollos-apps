import gql from 'graphql-tag';

export default gql`
  query getFeedFeatures {
    userFeedFeatures {
      id
      __typename
    }
  }
`;
