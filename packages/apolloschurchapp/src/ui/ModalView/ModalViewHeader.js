import React from 'react';
import { StatusBar, TouchableOpacity, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import styled from 'apolloschurchapp/src/ui/styled';
import Icon from 'apolloschurchapp/src/ui/Icon';
import { withTheme } from 'apolloschurchapp/src/ui/theme';

const CloseIcon = withTheme(({ theme }) => ({
  name: 'close',
  fill: theme.colors.text.tertiary,
  size: theme.sizing.baseUnit,
}))(Icon);

const BackIcon = withTheme(({ theme }) => ({
  name: 'arrow-back',
  fill: theme.colors.text.tertiary,
  size: theme.sizing.baseUnit,
}))(Icon);

const RightTouchable = styled(({ theme }) => ({
  position: 'absolute',
  top: theme.sizing.baseUnit * 1.5,
  right: theme.sizing.baseUnit * 1.5,
  width: theme.sizing.baseUnit * 1.75,
  height: theme.sizing.baseUnit * 1.75,
  borderRadius: theme.sizing.baseUnit * 1.75,
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  backgroundColor: theme.colors.text.primary,
  opacity: 0.9,
}))(TouchableOpacity);

const LeftTouchable = styled(({ theme }) => ({
  position: 'absolute',
  top: theme.sizing.baseUnit * 1.5,
  left: theme.sizing.baseUnit * 1.5,
  width: theme.sizing.baseUnit * 1.75,
  height: theme.sizing.baseUnit * 1.75,
  borderRadius: theme.sizing.baseUnit * 1.75,
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  backgroundColor: theme.colors.text.primary,
  opacity: 0.9,
}))(TouchableOpacity);

const Handle = styled({
  // helps in swipe-to-close gesture
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: 75,
})(View);

const ModalView = ({ onClose, onBack }) => (
  <>
    <StatusBar hidden />
    <Handle />
    {onBack ? (
      <LeftTouchable onPress={onBack}>
        <BackIcon />
      </LeftTouchable>
    ) : null}
    {onClose ? (
      <RightTouchable onPress={onClose}>
        <CloseIcon />
      </RightTouchable>
    ) : null}
  </>
);

export default ModalView;
