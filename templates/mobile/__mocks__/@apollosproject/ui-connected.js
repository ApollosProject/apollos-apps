import { gql } from '@apollo/client';
import ApollosConfig from '@apollosproject/config';

export const GET_USER_PROFILE = gql`
  query CurrentUserProfile {
    currentUser {
      id
      profile {
        ...UserProfileParts
        campus {
          ...CampusParts
        }
      }
    }
  }
  ${ApollosConfig.FRAGMENTS.CAMPUS_PARTS_FRAGMENT}
  ${ApollosConfig.FRAGMENTS.USER_PROFILE_PARTS_FRAGMENT}
`;

export const UserAvatarUpdate = 'UserAvatarUpdate';
export const usePersonFollowing = () => ({ total: 1 });
export const usePersonFollowedBy = () => ({ total: 1 });
export const useCurrentUserFollowRequests = () => ({ total: 1 });
