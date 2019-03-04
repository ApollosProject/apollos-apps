import gql from 'graphql-tag';

export default gql`
  query getAllCampuses {
    campuses {
      node {
        id
        name
        latitude
        longitude
        distanceFromLocation
      }
    }
  }
`;
