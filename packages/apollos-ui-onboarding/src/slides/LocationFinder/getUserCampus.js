import gql from 'graphql-tag';
import ApollosConfig from '@apollosproject/config';

export default gql`
  query getCurrentCampus {
    currentUser {
      id
      profile {
        id
        campus {
          ...CampusParts
        }
      }
    }
  }
  ${ApollosConfig.FRAGMENTS.CAMPUS_PARTS_FRAGMENT}
`;
