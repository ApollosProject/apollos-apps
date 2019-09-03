import React from 'react';
import { StatusBar, View } from 'react-native';
import Color from 'color';
import PropTypes from 'prop-types';

import { withTheme } from '../theme';
import { ButtonIcon } from '../Button';
import styled from '../styled';
import PaddedView from '../PaddedView';
import Icon from '../Icon';

const StyledButtonIcon = withTheme(({ theme }) => ({
  fill: theme.colors.white,
  size: theme.sizing.baseUnit,
  iconPadding: theme.sizing.baseUnit * 0.5, // TODO: decreases button tappability but gives us the desired "smaller button" look
  style: {
    backgroundColor: Color(theme.colors.text.primary).fade(0.3),
  },
}))(ButtonIcon);

const HeaderWrapper = styled(({ navigationHeader }) => ({
  position: navigationHeader ? 'relative' : 'absolute',
  top: 0,
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
}))(PaddedView);

const Handle = styled({
  // helps in swipe-to-close gesture
  position: 'absolute',
  width: '100%',
  height: 75,
})(View);

const ModalViewHeader = ({ onClose, onBack, navigationHeader }) => (
  <HeaderWrapper navigationHeader={navigationHeader}>
    <StatusBar hidden />
    <Handle />
    {onBack ? (
      <StyledButtonIcon name={'arrow-back'} onPress={onBack} />
    ) : (
      <Icon name="empty" />
    )}
    {onClose ? (
      <StyledButtonIcon name={'close'} onPress={onClose} />
    ) : (
      <Icon name="empty" />
    )}
  </HeaderWrapper>
);

ModalViewHeader.propTypes = {
  onClose: PropTypes.func,
  onBack: PropTypes.func,
  navigationHeader: PropTypes.bool,
};

export default ModalViewHeader;
