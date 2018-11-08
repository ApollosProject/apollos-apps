import React from 'react';
import {
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import styled from 'apolloschurchapp/src/ui/styled';

const RoundedWrapper = styled(({ borderRadius }) => ({
  borderRadius: borderRadius || null,
  overflow: 'hidden',
  backgroundColor: 'salmon',
}))(View);

const AndroidWrapper = ({ borderRadius, children }) =>
  Platform.OS === 'android' ? (
    <RoundedWrapper borderRadius={borderRadius} round>
      {children}
    </RoundedWrapper>
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
  children: PropTypes.node,
};

Touchable.defaultProps = {
  activeOpacity: 0.5,
};

export default Touchable;
