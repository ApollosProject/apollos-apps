import React, { useState } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';

import useFollowPerson from '../hooks/useFollowPerson';

import { H5, H6, ImageSourceType, useTheme } from '@apollosproject/ui-kit';
import FollowListImage from './FollowListImage';
import { ListItemStyles } from '../PersonFollowingConnected.styles';

import { ConfirmButton, HideButton, RequestButton } from '.';

const FollowListItem = ({
  personId,
  hideBorder,
  name,
  profile,
  availableActions,
}) => {
  const [accessoryText, setAcessoryText] = useState(null);
  const {
    data,
    currentUserIsFollowing,
    isFollowingCurrentUser,
    loading,
  } = useFollowPerson(personId);
  const theme = useTheme();
  const confirmActionEnabled = availableActions?.includes(
    'ACCEPT_FOLLOW_REQUEST'
  );
  const requestActionEnabled = availableActions?.includes(
    'SEND_FOLLOW_REQUEST'
  );

  function renderAccessories() {
    if (loading && !data) {
      return null;
    }

    if (confirmActionEnabled && isFollowingCurrentUser?.state === 'REQUESTED') {
      return (
        <>
          <ConfirmButton
            personId={personId}
            onCompleted={() => setAcessoryText('Confirmed')}
          />
          <HideButton
            personId={personId}
            onCompleted={() => setAcessoryText('Hidden')}
          />
        </>
      );
    }

    if (
      requestActionEnabled &&
      !currentUserIsFollowing &&
      currentUserIsFollowing !== undefined
    ) {
      return (
        <RequestButton
          personId={personId}
          onCompleted={() => setAcessoryText('Request Sent')}
        />
      );
    }

    return null;
  }

  return (
    <View style={ListItemStyles.container(theme)}>
      <FollowListImage profile={profile} />
      <View style={ListItemStyles.content(theme, hideBorder)}>
        <Text style={ListItemStyles.textContainer}>
          {Boolean(name) && <H5 numberOfLines={1}>{name}</H5>}
        </Text>

        {Boolean(accessoryText) && (
          <H6 style={ListItemStyles.accessoryLabel(theme)}>{accessoryText}</H6>
        )}

        {renderAccessories()}
      </View>
    </View>
  );
};

FollowListItem.propTypes = {
  /** Person Id for fetching data to display in the row */
  personId: PropTypes.string,
  /** removes the border that appears under the name. Typically, you'll want to do this for the last item in a list */
  hideBorder: PropTypes.bool,
  /** text that is displayed as the user's name */
  name: PropTypes.string,
  /** profile object is used to construct the avatar displayed inline, when no imageSource is provided, the first initial of the firstName and first initial of the lastName will be used. For example, Anakin Skywalker become 'AS' */
  profile: PropTypes.shape({
    photo: ImageSourceType,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }),
  /** array of actions that should be enabled for the current user */
  availableActions: PropTypes.arrayOf(
    PropTypes.oneOf(['ACCEPT_FOLLOW_REQUEST', 'SEND_FOLLOW_REQUEST'])
  ),
};

FollowListItem.defaultProps = {
  hideBorder: false,
  availableActions: [],
};

export default FollowListItem;
