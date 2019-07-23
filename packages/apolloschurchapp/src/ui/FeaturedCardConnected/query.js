import gql from 'graphql-tag';

const GET_CONTENT_CARD = gql`
  query getContentCard($contentId: ID!, $tile: Boolean!) {
    node(id: $contentId) {
      id
      __typename
      ... on ContentItem {
        title
        summary
        isLiked
        coverImage {
          sources {
            uri
          }
        }
        videos {
          sources {
            uri
          }
        }
        parentChannel {
          name
        }
        theme {
          type
          colors {
            primary
            secondary
            screen
            paper
          }
        }
      }
      ... on WeekendContentItem {
        liveStream {
          isLive
        }
      }
    }
  }
`;

export default GET_CONTENT_CARD;
