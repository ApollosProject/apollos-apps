import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import styled from '../styled';
import { H4 } from '../typography';
import ModalButton from './ModalButton';

const Header = styled(({ theme }) => ({
  width: '100%',
  height: theme.sizing.baseUnit * 4,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.sizing.baseUnit,
}))(View);

function ModalHeader({
  onPrevious,
  onNext,
  title,
  onPreviousText,
  onNextText,
}) {
  return (
    <Header>
      <ModalButton onPress={onPrevious} title={onPreviousText} />
      <H4>{title}</H4>
      <ModalButton onPress={onNext} title={onNextText} />
    </Header>
  );
}

ModalHeader.propTypes = {
  onPrevious: PropTypes.func,
  onPreviousText: PropTypes.string,
  onNext: PropTypes.func,
  onNextText: PropTypes.string,
  title: PropTypes.string,
};

export default ModalHeader;
