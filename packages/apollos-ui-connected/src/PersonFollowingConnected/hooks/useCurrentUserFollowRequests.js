import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client';

export const GET_CURRENT_USER_FOLLOW_REQUESTS = gql`
  query currentUserFollowRequests {
    followRequests {
      id
      firstName
      lastName
      photo {
        uri
      }
      followingCurrentUser {
        id
        state
      }
      currentUserFollowing {
        id
        state
      }
    }
  }
`;

const useCurrentUserFollowRequests = () => {
  const query = useQuery(GET_CURRENT_USER_FOLLOW_REQUESTS, {
    fetchPolicy: 'cache-and-network',
  });
  const followRequests = query?.data?.followRequests || [];
  const total =
    followRequests?.filter(
      ({ followingCurrentUser }) => followingCurrentUser.state === 'REQUESTED'
    ).length || 0;

  return {
    ...query,
    total,
    followRequests,
  };
};

export default useCurrentUserFollowRequests;
