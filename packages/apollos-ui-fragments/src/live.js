import gql from 'graphql-tag';

export const LiveStreamFragment = gql`
fragment LiveStreamFragment {
    isLive
    eventStartTime
    media {
      sources {
        uri
      }
    }
    webViewUrl

    contentItem {
      ... on WeekendContentItem {
        id
      }
    }
  }
`;
