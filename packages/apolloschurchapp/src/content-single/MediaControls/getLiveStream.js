import gql from 'graphql-tag';

export default gql`
  query GetLiveStream($contentId: ID!) {
    node(id: $contentId) {
      id
      ... on WeekendContentItem {
        liveStream {
          isLive
          media {
            sources {
              uri
            }
          }
          webViewUrl
        }
      }
    }
  }
`;
