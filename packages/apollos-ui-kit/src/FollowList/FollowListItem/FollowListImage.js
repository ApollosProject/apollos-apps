import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '../../theme';
import { ImageSourceType } from '../../ConnectedImage';
import { withIsLoading } from '../../isLoading';
import Avatar from '../../Avatar';

const CellImage = withTheme(
  ({ theme }) => ({
    themeSize: theme.sizing.baseUnit * 4,
    containerStyle: {
      marginRight: theme.sizing.baseUnit,
    },
  }),
  'ui-kit.FollowList.FollowListItem.FollowListImage.CellImage'
)(Avatar);

const FollowListImage = ({ isLoading, profile }) => {
  if (isLoading) {
    return <CellImage size="small" profile={profile} />;
  }
  return <CellImage size="small" profile={profile} />;
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
