import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';

export const ACCEPT_FOLLOW_REQUEST = gql`
  mutation acceptFollowRequest($personId: ID!) {
    acceptFollowRequest(requestPersonId: $personId) {
      id
      state
    }
  }
`;

const useAcceptFollowRequest = (personId) => {
  const acceptFollowRequestMutation = useMutation(ACCEPT_FOLLOW_REQUEST, {
    variables: {
      personId,
    },
    onError: (error) => {
      console.log(error);
    },
    update(cache) {
      cache.modify({
        fields: {
          /**
           * Get the current user, find the person record and manually increment the totalCount of followers by 1 so the user can see any UI element of the count increase immediately.
           */
          currentUser(currentUserRef, { readField }) {
            const personRef = readField('profile', currentUserRef);
            const id = readField('id', personRef);
            const followedBy = readField('followedBy', personRef);
            cache.writeFragment({
              id: cache.identify(personRef),
              fragment: gql`
                fragment PersonFragment on Person {
                  id
                  followedBy {
                    totalCount
                  }
                }
              `,
              data: {
                id,
                followedBy: {
                  totalCount: followedBy.totalCount + 1,
                },
              },
            });

            return currentUserRef;
          },
        },
      });
    },
  });

  return acceptFollowRequestMutation;
};

export default useAcceptFollowRequest;
