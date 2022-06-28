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
  iconButtonProps,
}) => {
  const { data, refetch } = useQuery(GET_USER_PHOTO, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (refetch && refetchRef) {
      refetchRef({ refetch, id: 'user-profile-image' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const profile = data?.currentUser?.profile || {};
  return (
    <Avatar
      buttonIcon={buttonIcon}
      iconButtonProps={iconButtonProps}
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
  iconButtonProps: PropTypes.object,
  isLoading: PropTypes.bool,
  onPressIcon: PropTypes.func,
  refetchRef: PropTypes.func,
  size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large']),
};

export default UserAvatarConnected;
