import React from 'react';
import {
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import styled from 'apolloschurchapp/src/ui/styled';

const AndroidRippleWrapper = styled(({ borderRadius }) => ({
  borderRadius,
  overflow: 'hidden',
}))(View);

const AndroidWrapper = ({ borderRadius, children }) =>
  Platform.OS === 'android' ? (
    <AndroidRippleWrapper borderRadius={borderRadius} round>
      {children}
    </AndroidRippleWrapper>
  ) : (
    children
  );

const PlatformTouchable =
  Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

const Touchable = ({ borderRadius, children, ...otherProps }) => (
  <AndroidWrapper borderRadius={borderRadius}>
    <PlatformTouchable {...otherProps}>{children}</PlatformTouchable>
  </AndroidWrapper>
);

Touchable.propTypes = {
  borderRadius: PropTypes.number,
  children: PropTypes.element,
};

Touchable.defaultProps = {
  activeOpacity: 0.5,
  borderRadius: 0,
};

export default Touchable;
