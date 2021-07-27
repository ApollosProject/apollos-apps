/* eslint-disable import/prefer-default-export */
import { gql } from '@apollo/client';

const TRACK = gql`
  mutation track($input: AnalyticsTrackInput!) {
    trackEvent(input: $input) {
      success
    }
  }
`;

const IDENTIFY = gql`
  mutation identify($input: AnalyticsIdentifyInput!) {
    identifySelf(input: $input) {
      success
    }
  }
`;

export { TRACK, IDENTIFY };
