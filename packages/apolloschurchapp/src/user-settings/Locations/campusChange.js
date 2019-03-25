import gql from 'graphql-tag';

export default gql`
  mutation campusChange($campusId: String!) {
    updateUserCampus(campusId: $campusId) {
      id
      campus {
        __typename
        name
      }
    }
  }
`;
