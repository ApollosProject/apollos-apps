import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';

export const IGNORE_FOLLOW_REQUEST = gql`
  mutation ignoreFollowRequest($personId: ID!) {
    ignoreFollowRequest(requestPersonId: $personId) {
      id
      state
    }
  }
`;

const useIgnoreFollowRequest = (personId) => {
  const ignoreFollowRequestMutation = useMutation(IGNORE_FOLLOW_REQUEST, {
    variables: {
      personId,
    },
  });

  return ignoreFollowRequestMutation;
};

export default useIgnoreFollowRequest;
