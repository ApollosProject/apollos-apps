import gql from 'graphql-tag';

const USER_PROFILE_PARTS_FRAGMENT = gql`
  fragment UserProfileParts on Person {
    id
    firstName
    lastName
    email
    nickName
    gender
    birthDate
    photo {
      uri
    }
  }
`;

export { USER_PROFILE_PARTS_FRAGMENT };
