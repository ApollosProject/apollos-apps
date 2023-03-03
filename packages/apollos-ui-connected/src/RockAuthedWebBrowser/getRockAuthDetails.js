import { gql } from '@apollo/client';

export const GET_ROCK_AUTH_DETAILS = gql`
  query RockAuthDetails {
    currentUser {
      id
      rock {
        authCookie
        authToken
      }
    }
  }
`;

export default GET_ROCK_AUTH_DETAILS;
