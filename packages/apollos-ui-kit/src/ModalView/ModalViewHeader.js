import React from 'react';
import { Platform } from 'react-native';
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

const HeaderWrapper = styled({
  position: 'absolute',
  zIndex: 999,
  top: 0,
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
})(PaddedView);

const ModalViewHeader = ({ onClose, onBack }) => (
  <HeaderWrapper pointerEvents={'box-none'}>
    {// android isn't working currently, hardware back button more reliable
    Platform.OS === 'android' ? null : (
      <>
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
      </>
    )}
  </HeaderWrapper>
);

ModalViewHeader.propTypes = {
  onClose: PropTypes.func,
  onBack: PropTypes.func,
};

export default ModalViewHeader;
