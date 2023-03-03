import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';

import { GET_PERSON_FOLLOW_STATE } from './useFollowPerson';

export const REQUEST_TO_FOLLOW = gql`
  mutation requestFollow($personId: ID!) {
    requestFollow(followedPersonId: $personId) {
      state
      id
    }
  }
`;

const useRequestToFollow = (personId) => {
  const requestToFollowMutation = useMutation(REQUEST_TO_FOLLOW, {
    variables: {
      personId,
    },
    refetchQueries: [GET_PERSON_FOLLOW_STATE],
  });

  return requestToFollowMutation;
};

export default useRequestToFollow;
