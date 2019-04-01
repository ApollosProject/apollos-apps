/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

const track = gql`
  mutation track($input: AnalyticsTrackInput!) {
    trackEvent(input: $input) {
      success
    }
  }
`;

const identify = gql`
  mutation identify($input: AnalyticsIdentifyInput!) {
    identifySelf(input: $input) {
      success
    }
  }
`;

export { track, identify };
