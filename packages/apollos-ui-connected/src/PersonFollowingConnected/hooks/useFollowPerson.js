import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client';

export const GET_PERSON_FOLLOW_STATE = gql`
  query getPerson($personId: ID!) {
    node(id: $personId) {
      id
      ... on Person {
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
  }
`;

const useFollowPerson = (personId) => {
  const query = useQuery(GET_PERSON_FOLLOW_STATE, {
    variables: {
      personId,
    },
    cachePolicy: 'cache-and-network',
  });

  const currentUserIsFollowing = query?.data?.node?.currentUserFollowing;
  const isFollowingCurrentUser = query?.data?.node?.followingCurrentUser;

  return {
    ...query,
    currentUserIsFollowing,
    isFollowingCurrentUser,
  };
};

export default useFollowPerson;
