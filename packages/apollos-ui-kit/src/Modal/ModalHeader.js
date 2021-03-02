import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import styled from '../styled';
import { H4 } from '../typography';
import ModalButton from './ModalButton';

const Header = styled(
  ({ theme }) => ({
    width: '100%',
    height: theme.sizing.baseUnit * 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.sizing.baseUnit,
  }),
  'ui-kit.ModalHeader.Header'
)(View);

function ModalHeader({
  onPrevious,
  onNext,
  title,
  onPreviousText = 'Back',
  onNextText = 'Next',
}) {
  return (
    <Header>
      <ModalButton
        onPress={onPrevious}
        title={onPrevious ? onPreviousText : null}
      />
      <H4>{title}</H4>
      <ModalButton onPress={onNext} title={onNext ? onNextText : null} />
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
