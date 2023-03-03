import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client';

import { PersonFollowListItemFragment, PAGE_LENGTH } from '../utils';

export const GET_PERSON_IS_FOLLOWING = gql`
  query GET_PERSON_IS_FOLLOWING($personId: ID!, $query: PeopleQueryInput) {
    node(id: $personId) {
      id
      ... on Person {
        following(query: $query) {
          ...PersonFollowListItemFragment
        }
      }
    }
  }

  ${PersonFollowListItemFragment}
`;

const usePersonFollowing = (personId) => {
  const query = useQuery(GET_PERSON_IS_FOLLOWING, {
    skip: !personId,
    fetchPolicy: 'cache-and-network',
    variables: {
      personId,
      query: {
        first: PAGE_LENGTH,
        after: null,
      },
    },
  });
  const following =
    query?.data?.node?.following?.edges?.map(({ node }) => node) || [];
  const total = query?.data?.node?.following?.totalCount || 0;
  const pageInfo = query?.data?.node?.following?.pageInfo || {
    startCursor: null,
    endCursor: null,
  };

  return {
    ...query,
    total,
    pageInfo,
    following,
  };
};

export default usePersonFollowing;
