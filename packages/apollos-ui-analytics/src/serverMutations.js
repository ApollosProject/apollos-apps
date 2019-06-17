/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

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
