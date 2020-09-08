import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import Avatar from '../Avatar';
import { ImageSourceType } from '../../ConnectedImage';
import styled from '../../styled';
import Touchable from '../../Touchable';
import { withTheme } from '../../theme';

const StyledAvatar = withTheme(
  ({ theme }) => ({
    containerStyle: {
      marginRight: theme.sizing.baseUnit * 0.5,
    },
    themeSize: theme.sizing.avatar.medium * 0.8,
  }),
  'ui-kit.Avatar.AvatarList.TouchableAvatarAndroid.StyledAvatar'
)(Avatar);

// This clips the Touchable ripple effect on android.
const AndroidTouchableRippleFix = styled(
  ({ theme }) => ({
    aspectRatio: 1,
    borderRadius: theme.sizing.avatar.medium * 0.4,
    overflow: 'hidden',
    position: 'absolute',
    width: theme.sizing.avatar.medium * 0.8,
  }),
  'ui-kit.Avatar.AvatarList.TouchableAvatarAndroid.AndroidTouchableRippleFix'
)(View);

// This is just a filler so there is something to tap on.
const TouchableChild = styled(
  {
    height: '100%',
    width: '100%',
  },
  'ui-kit.Avatar.AvatarList.TouchableAvatarAndroid.TouchableChild'
)(View);

/*
 * Due to the fact that `StyledAvatar` has a notification dot that partially renders outside it's
 * round shape we have to be creative on how we emplement our `AndroidTouchableRippleFix`. If
 * `StyledAvatar` was a child of the `Touchable` part of it's notification dot would be clipped. By
 * layering the `Touchable` over the `StyledAvatar` we get the same desired outcome without the
 * ripple fix getting in the way. The only draw back to this is that on press part of the
 * notification dot is not covered by the ripple effect, however, nothing is adversely clipped so it
 * does feel broken either. Furthermore, this fix only seems to work if it lives in it's own
 * `.android` file 😢
 */
const TouchableAvatar = ({ disabled, notification, onPress, source }) => (
  <View>
    <StyledAvatar source={source} notification={notification} />
    <AndroidTouchableRippleFix>
      <Touchable disabled={disabled} onPress={onPress}>
        <TouchableChild collapsable={false} />
      </Touchable>
    </AndroidTouchableRippleFix>
  </View>
);

TouchableAvatar.propTypes = {
  disabled: PropTypes.bool,
  notification: PropTypes.bool,
  onPress: PropTypes.func,
  source: ImageSourceType,
};

export default TouchableAvatar;
