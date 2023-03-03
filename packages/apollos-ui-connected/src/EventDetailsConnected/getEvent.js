import gql from 'graphql-tag';

export const EVENT_FRAGMENT = gql`
  fragment eventFragment on Event {
    id
    title
    location
    start
    end
    htmlContent
    coverImage {
      sources {
        uri
      }
    }
  }
`;

export default gql`
  query getEvent($eventId: ID!) {
    node(id: $eventId) {
      __typename
      ... on Event {
        ...eventFragment
      }
    }
  }
  ${EVENT_FRAGMENT}
`;
