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

const CAMPUS_PARTS_FRAGMENT = gql`
  fragment CampusParts on Campus {
    id
    name
    latitude
    longitude
    distanceFromLocation
    street1
    street2
    city
    state
    postalCode
    image {
      uri
    }
  }
`;

export { USER_PROFILE_PARTS_FRAGMENT, CAMPUS_PARTS_FRAGMENT };
