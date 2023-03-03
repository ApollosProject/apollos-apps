import { gql } from '@apollo/client';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query getLiveContent {
    liveStreams {
      ...LiveStreamFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.LIVE_STREAM_FRAGMENT}
`;
