import React from 'react';
import { Platform } from 'react-native';
import PropTypes from 'prop-types';

import styled from '../styled';
import PaddedView from '../PaddedView';
import Icon from '../Icon';
import { ModalBackButton, ModalCloseButton } from './ModalButtons';

export { ModalBackButton, ModalCloseButton };

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
    {
      // android isn't working currently, hardware back button more reliable
      Platform.OS === 'android' ? null : (
        <>
          {onBack ? (
            <ModalBackButton onPress={onBack} />
          ) : (
            <Icon name="empty" />
          )}
          {onClose ? (
            <ModalCloseButton name={'close'} onPress={onClose} />
          ) : (
            <Icon name="empty" />
          )}
        </>
      )
    }
  </HeaderWrapper>
);

ModalViewHeader.propTypes = {
  onClose: PropTypes.func,
  onBack: PropTypes.func,
};

export default ModalViewHeader;
