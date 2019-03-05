import gql from 'graphql-tag';

export default gql`
  query getAllCampuses($latitude: Float!, $longitude: Float!) {
    campuses(location: { latitude: $latitude, longitude: $longitude }) {
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
  }
`;
