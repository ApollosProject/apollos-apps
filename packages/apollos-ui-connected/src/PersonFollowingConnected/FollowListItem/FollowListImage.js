/**
 * FollowListImage.js
 *
 * Avatar of a person that sits to the left of the FollowListItem
 */

import React from 'react';
import PropTypes from 'prop-types';

import { ListItemStyles } from '../PersonFollowingConnected.styles';

import {
  Avatar,
  ImageSourceType,
  withIsLoading,
  useTheme,
} from '@apollosproject/ui-kit';

const FollowListImage = ({ profile }) => {
  const theme = useTheme();
  const themeSize = theme.sizing.baseUnit * 4;

  return (
    <Avatar
      size="small"
      profile={profile}
      themeSize={themeSize}
      containerStyle={ListItemStyles.avatar}
    />
  );
};

FollowListImage.propTypes = {
  isLoading: PropTypes.bool,
  profile: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    photo: ImageSourceType,
  }),
};

export default withIsLoading(FollowListImage);
