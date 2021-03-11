import gql from 'graphql-tag';

export default gql`
  mutation acceptFollowRequest($personId: ID!) {
    acceptFollowRequest(requestPersonId: $personId) {
      state
      id
    }
  }
`;
