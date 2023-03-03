import { gql } from '@apollo/client';

const LIVE_STREAM_FRAGMENT = gql`
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

export { LIVE_STREAM_FRAGMENT };
