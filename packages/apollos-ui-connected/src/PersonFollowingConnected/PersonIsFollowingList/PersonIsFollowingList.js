/**
 * PersonIsFollowingList.js
 *
 * A list of users that a given person is following. The current iteration of the list is intended to be readonly.
 *
 */

import React from 'react';

import { getProfile, mapHideBorder, PAGE_LENGTH } from '../utils';

import { ListStyles } from '../PersonFollowingConnected.styles';
import { FeedView, useTheme } from '@apollosproject/ui-kit';
import FollowListItem from '../FollowListItem';
import usePersonFollowing from '../hooks/usePersonFollowing';

function renderItem({ item }) {
  const { name, profile } = getProfile(item);

  return (
    <FollowListItem
      personId={item?.id}
      name={name}
      profile={profile}
      hideBorder={item.hideBorder}
    />
  );
}

const PersonIsFollowingList = ({ personId }) => {
  const theme = useTheme();
  const {
    following,
    pageInfo,
    loading,
    error,
    refetch,
    fetchMore,
  } = usePersonFollowing(personId);

  return (
    <FeedView
      keyExtractor={({ id }) => id}
      content={mapHideBorder(following)}
      renderItem={renderItem}
      error={error}
      isLoading={loading}
      refetch={refetch}
      fetchMore={() => {
        fetchMore({
          variables: {
            personId,
            query: {
              first: PAGE_LENGTH,
              after: pageInfo.endCursor,
            },
          },
        });
      }}
      contentContainerStyle={ListStyles.container(theme)}
    />
  );
};

export default PersonIsFollowingList;
