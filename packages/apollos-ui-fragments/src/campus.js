import gql from 'graphql-tag';

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

export { CAMPUS_PARTS_FRAGMENT };
