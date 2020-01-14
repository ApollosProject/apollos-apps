import gql from 'graphql-tag';

export const LIVE_STREAM_FRAGMENT = gql`
  fragment LiveStreamFragment on LiveStream {
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
