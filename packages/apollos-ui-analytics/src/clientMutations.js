/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

const track = gql`
  mutation track($properties: [AnalyticsMetaField]!, $eventName: String!) {
    track(properties: $properties, eventName: $eventName) @client
  }
`;

const identify = gql`
  mutation identify {
    identify @client
  }
`;

export { track, identify };
