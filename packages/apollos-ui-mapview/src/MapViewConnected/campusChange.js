import { gql } from '@apollo/client';
import ApollosConfig from '@apollosproject/config';

export default gql`
  mutation campusChange($campusId: String!) {
    updateUserCampus(campusId: $campusId) {
      id
      campus {
        ...CampusParts
      }
    }
  }
  ${ApollosConfig.FRAGMENTS.CAMPUS_PARTS_FRAGMENT}
`;
