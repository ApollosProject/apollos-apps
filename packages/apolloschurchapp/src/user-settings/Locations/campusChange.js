import gql from 'graphql-tag';

export default gql`
  mutation campusChange($campusId: String!) {
    updateUserCampus(campusId: $campusId) {
      id
      campus {
        __typename
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
  }
`;
