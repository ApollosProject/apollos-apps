import React from 'react';
import PropTypes from 'prop-types';
import UserAvatarView from 'apolloschurchapp/src/ui/UserAvatarView';

const UserAvatarHeader = ({ firstName, lastName, photo, refetch }) => (
  <UserAvatarView
    firstName={firstName}
    lastName={lastName}
    photo={photo}
    refetch={refetch}
  />
);

UserAvatarHeader.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  photo: PropTypes.string,
  refetch: PropTypes.string,
};

export default UserAvatarHeader;
