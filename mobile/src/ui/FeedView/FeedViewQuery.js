import gql from 'graphql-tag';

const GET_USER_FEED = gql`
  {
    userFeed {
      edges {
        node {
          id
          __typename
          title
          images {
            name
            sources {
              uri
            }
          }
        }
      }
    }
  }
`;

export default GET_USER_FEED;
