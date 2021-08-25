import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';

import { Avatar } from '@apollosproject/ui-kit';
import GET_USER_PHOTO from './getUserPhoto';

const UserAvatarConnected = ({
  buttonIcon,
  containerStyle,
  iconFill,
  isLoading,
  onPressIcon,
  refetchRef,
  size,
}) => {
  const { data, refetch } = useQuery(GET_USER_PHOTO, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (refetch && refetchRef)
      refetchRef({ refetch, id: 'user-profile-image' });
  }, []);

  const profile = data?.currentUser?.profile || {};
  return (
    <Avatar
      buttonIcon={buttonIcon}
      containerStyle={containerStyle}
      iconFill={iconFill}
      isLoading={isLoading}
      onPressIcon={onPressIcon}
      size={size}
      profile={profile}
    />
  );
};

UserAvatarConnected.propTypes = {
  buttonIcon: PropTypes.string,
  containerStyle: PropTypes.any, // eslint-disable-line
  iconFill: PropTypes.string,
  isLoading: PropTypes.bool,
  onPressIcon: PropTypes.func,
  refetchRef: PropTypes.func,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default UserAvatarConnected;
