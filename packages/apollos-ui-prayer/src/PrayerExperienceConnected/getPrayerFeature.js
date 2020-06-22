import gql from 'graphql-tag';

import ApollosConfig from '@apollosproject/config';

export default gql`
  query($id: ID!) {
    currentUser {
      id
      profile {
        id
        photo {
          uri
        }
      }
    }
    feature: node(id: $id) {
      ...PrayerListFeatureFragment
    }
  }
  ${ApollosConfig.FRAGMENTS.PRAYER_LIST_FEATURE_FRAGMENT}
`;
