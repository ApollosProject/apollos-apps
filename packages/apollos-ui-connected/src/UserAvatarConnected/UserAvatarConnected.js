import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Query } from 'react-apollo';

import { Avatar } from '@apollosproject/ui-kit';
import GET_USER_PHOTO from './getUserPhoto';

const GetPhotoData = ({ children }) => (
  <Query query={GET_USER_PHOTO}>
    {({ data: { currentUser = {} } = {} }) => {
      const photo = get(currentUser, 'profile.photo');
      return children({ photo });
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
    {({ photo }) => (
      <Avatar
        buttonIcon={buttonIcon}
        containerStyle={containerStyle}
        iconFill={iconFill}
        isLoading={isLoading}
        onPressIcon={onPressIcon}
        size={size}
        source={photo}
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
