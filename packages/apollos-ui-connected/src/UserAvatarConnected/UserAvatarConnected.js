import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Query } from '@apollo/client/react/components';

import { Avatar } from '@apollosproject/ui-kit';
import GET_USER_PHOTO from './getUserPhoto';

const GetPhotoData = ({ children }) => (
  <Query query={GET_USER_PHOTO} fetchPolicy={'cache-and-network'}>
    {({ data: { currentUser = {} } = {} }) => {
      const profile = get(currentUser, 'profile', {});
      return children(profile);
    }}
  </Query>
);

GetPhotoData.propTypes = {
  children: PropTypes.func.isRequired,
};

const UserAvatarConnected = ({
  buttonIcon,
  containerStyle,
  iconFill,
  isLoading,
  onPressIcon,
  size,
}) => (
  <GetPhotoData>
    {(profile) => (
      <Avatar
        buttonIcon={buttonIcon}
        containerStyle={containerStyle}
        iconFill={iconFill}
        isLoading={isLoading}
        onPressIcon={onPressIcon}
        size={size}
        profile={profile}
      />
    )}
  </GetPhotoData>
);

UserAvatarConnected.propTypes = {
  buttonIcon: PropTypes.string,
  containerStyle: PropTypes.any, // eslint-disable-line
  iconFill: PropTypes.string,
  isLoading: PropTypes.bool,
  onPressIcon: PropTypes.func,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default UserAvatarConnected;
