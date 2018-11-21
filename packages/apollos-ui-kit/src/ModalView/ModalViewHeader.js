import React from 'react';
import { StatusBar, View } from 'react-native';
import Color from 'color';

import styled from '../styled';
import { ButtonIcon } from '../Button';
import { withTheme } from '../theme';

const StyledButtonIcon = withTheme(({ theme }) => ({
  fill: theme.colors.text.tertiary,
  size: theme.sizing.baseUnit,
  iconPadding: theme.sizing.baseUnit * 1.75,
}))(ButtonIcon);

const ButtonWrapper = styled(({ theme, right, left }) => ({
  position: 'absolute',
  top: theme.sizing.baseUnit * 1.5,
  right: right ? theme.sizing.baseUnit * 1.5 : null,
  left: left ? theme.sizing.baseUnit * 1.5 : null,
  width: theme.sizing.baseUnit * 1.75,
  height: theme.sizing.baseUnit * 1.75,
  borderRadius: theme.sizing.baseUnit * 1.75,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: Color(theme.colors.text.primary).fade(0.1),
  zIndex: 2,
}))(View);

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
      <ButtonWrapper left>
        <StyledButtonIcon name={'arrow-back'} onPress={onBack} />
      </ButtonWrapper>
    ) : null}
    {onClose ? (
      <ButtonWrapper right>
        <StyledButtonIcon name={'close'} onPress={onClose} />
      </ButtonWrapper>
    ) : null}
  </>
);

export default ModalView;
