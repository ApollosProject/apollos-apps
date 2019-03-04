import gql from 'graphql-tag';

export default gql`
  query getAllCampuses {
    campuses {
      id
      name
      description
      latitude
      longitude
      image
      distanceFromLocation
    }
  }
`;
