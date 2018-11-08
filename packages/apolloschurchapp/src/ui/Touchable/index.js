import React from 'react';
import {
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import styled from 'apolloschurchapp/src/ui/styled';

const RoundWrapper = styled(({ size }) => ({
  borderRadius: size,
  overflow: 'hidden',
  backgroundColor: 'salmon',
}))(View);

const RoundAndroidWrapper = ({ round, size, children }) =>
  Platform.OS === 'android' && round ? (
    <RoundWrapper size={size}>{children}</RoundWrapper>
  ) : (
    children
  );

const PlatformTouchable =
  Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

const Touchable = ({ round, children, size, ...otherProps }) => (
  <RoundAndroidWrapper round={round} size={size}>
    <PlatformTouchable {...otherProps}>{children}</PlatformTouchable>
  </RoundAndroidWrapper>
);

Touchable.propTypes = {
  round: PropTypes.bool,
  size: PropTypes.number,
  children: PropTypes.node,
};

Touchable.defaultProps = {
  activeOpacity: 0.5,
};

export default Touchable;
