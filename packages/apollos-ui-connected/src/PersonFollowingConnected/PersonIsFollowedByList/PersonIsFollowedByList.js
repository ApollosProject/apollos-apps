/**
 * PersonIsFollowedByList.js
 *
 * Displays a paginated list of people that the specified person is following. If the person is the current user, we will also see a list of "Follow Requests" on the header
 */

import React from 'react';
import PropTypes from 'prop-types';

import useCurrentUserFollowRequests from '../hooks/useCurrentUserFollowRequests';
import usePersonFollowedBy from '../hooks/usePersonFollowedBy';
import { getProfile, mapHideBorder, PAGE_LENGTH } from '../utils';

import {
  HeaderComponentStyles,
  ListStyles,
} from '../PersonFollowingConnected.styles';
import { View, Text } from 'react-native';
import { FeedView, useTheme } from '@apollosproject/ui-kit';
import FollowListItem from '../FollowListItem';

function renderItem({ item }) {
  const { name, profile } = getProfile(item);

  return (
    <FollowListItem
      personId={item?.id}
      name={name}
      profile={profile}
      hideBorder={item?.hideBorder}
      availableActions={['ACCEPT_FOLLOW_REQUEST', 'SEND_FOLLOW_REQUEST']}
      key={item?.id}
    />
  );
}

const CurrentUserFollowRequests = () => {
  const { followRequests } = useCurrentUserFollowRequests();
  const theme = useTheme();

  if (followRequests?.length === 0) {
    return null;
  }

  return (
    <View style={HeaderComponentStyles.container(theme)}>
      <Text style={HeaderComponentStyles.title(theme)}>Requests</Text>
      {followRequests.map((n, i) =>
        renderItem({
          item: {
            ...n,
            hideBorder: i === followRequests.length - 1,
          },
        })
      )}
    </View>
  );
};

const PersonIsFollowedByList = ({ personId }) => {
  const theme = useTheme();
  const { refetch: refetchFollowRequests } = useCurrentUserFollowRequests();
  const {
    followedBy,
    pageInfo,
    loading,
    error,
    refetch,
    fetchMore,
  } = usePersonFollowedBy(personId);

  function handleRefetch() {
    refetch({
      first: PAGE_LENGTH,
      after: null,
    });
    refetchFollowRequests();
  }

  return (
    <FeedView
      keyExtractor={({ id }) => id}
      content={mapHideBorder(followedBy)}
      renderItem={renderItem}
      error={error}
      isLoading={loading}
      refetch={handleRefetch}
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
      ListHeaderComponent={
        <CurrentUserFollowRequests refetch={handleRefetch} />
      }
      contentContainerStyle={ListStyles.container(theme)}
    />
  );
};

PersonIsFollowedByList.propTypes = {
  /** Id of the person who's "followers" we're viewing. If this is equal to the Current User's id, we will see "Follow Requests" on the header */
  personId: PropTypes.string.isRequired,
};
PersonIsFollowedByList.defaultProps = {};

export default PersonIsFollowedByList;
