import gql from 'graphql-tag';

export default gql`
  mutation requestFollow($personId: ID!) {
    requestFollow(followedPersonId: $personId) {
      state
      id
    }
  }
`;
