import gql from 'graphql-tag';

export default gql`
  query getCurrentCampus {
    currentUser {
      id
      profile {
        id
        campus {
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
  }
`;
