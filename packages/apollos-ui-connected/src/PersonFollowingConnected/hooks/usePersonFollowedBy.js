import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client';

import { PersonFollowListItemFragment, PAGE_LENGTH } from '../utils';

export const GET_PERSON_IS_FOLLOWED_BY = gql`
  query getPersonIdFollowedBy($personId: ID!, $query: PeopleQueryInput) {
    node(id: $personId) {
      id
      ... on Person {
        followedBy(query: $query) {
          ...PersonFollowListItemFragment
        }
      }
    }
  }

  ${PersonFollowListItemFragment}
`;

const usePersonFollowedBy = (personId) => {
  const query = useQuery(GET_PERSON_IS_FOLLOWED_BY, {
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
  const followedBy =
    query?.data?.node?.followedBy?.edges?.map(({ node }) => node) || [];
  const total = query?.data?.node?.followedBy?.totalCount || 0;
  const pageInfo = query?.data?.node?.followedBy?.pageInfo || {
    startCursor: null,
    endCursor: null,
  };

  return {
    ...query,
    total,
    pageInfo,
    followedBy,
  };
};

export default usePersonFollowedBy;
