const USER_PROFILE_PARTS_FRAGMENT = gql`
fragment UserProfileParts {
  ... on Profile {
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
}`;
