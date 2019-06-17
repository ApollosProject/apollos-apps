/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

const TRACK = gql`
  mutation track($properties: [AnalyticsMetaField]!, $eventName: String!) {
    track(properties: $properties, eventName: $eventName) @client
  }
`;

const IDENTIFY = gql`
  mutation identify {
    identify @client
  }
`;

export { TRACK, IDENTIFY };
