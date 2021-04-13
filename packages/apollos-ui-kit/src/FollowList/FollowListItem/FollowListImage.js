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

const FollowListImage = ({ isLoading, source, initials }) => {
  if (isLoading) {
    return <CellImage size="small" initials={initials} />;
  }
  return <CellImage size="small" source={source} initials={initials} />;
};

FollowListImage.propTypes = {
  source: ImageSourceType,
  isLoading: PropTypes.bool,
  initials: PropTypes.string,
};

export default withIsLoading(FollowListImage);
