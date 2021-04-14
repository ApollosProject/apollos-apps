import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '../Avatar';
import { ImageSourceType } from '../../ConnectedImage';
import Touchable from '../../Touchable';
import { withTheme } from '../../theme';

const StyledAvatar = withTheme(
  ({ theme }) => ({
    containerStyle: {
      marginRight: theme.sizing.baseUnit * 0.5,
    },
    themeSize: theme.sizing.avatar.medium * 0.8,
  }),
  'ui-kit.Avatar.AvatarList.TouchableAvatarIos.StyledAvatar'
)(Avatar);

// See the `.android` verson of this component for an explination of what and why.
const TouchableAvatar = ({
  disabled,
  notification,
  onPress,
  profile,
  source,
}) => (
  <Touchable disabled={disabled} onPress={onPress}>
    <StyledAvatar
      profile={profile}
      source={source}
      notification={notification}
    />
  </Touchable>
);

TouchableAvatar.propTypes = {
  disabled: PropTypes.bool,
  notification: PropTypes.bool,
  onPress: PropTypes.func,
  source: ImageSourceType,
  profile: PropTypes.shape({
    photo: ImageSourceType,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }),
};

export default TouchableAvatar;
