import { gql } from '@apollo/client';

export function getProfile(person) {
  return {
    name: `${person?.firstName} ${person?.lastName}`,
    profile: {
      firstName: person?.firstName ?? '',
      lastName: person?.lastName ?? '',
      photo: person?.photo?.uri,
    },
  };
}

export function mapHideBorder(items) {
  return items.map((n, i) => ({
    ...n,
    hideBorder: i === items.length - 1,
  }));
}

export const PersonFollowListItemFragment = gql`
  fragment PersonFollowListItemFragment on SearchPeopleResultsConnection {
    edges {
      cursor
      node {
        id
        firstName
        lastName
        photo {
          uri
        }
        currentUserFollowing {
          id
          state
        }
        followingCurrentUser {
          id
          state
        }
      }
    }
    pageInfo {
      startCursor
      endCursor
    }
    totalCount
  }
`;

export const PAGE_LENGTH = 20;
