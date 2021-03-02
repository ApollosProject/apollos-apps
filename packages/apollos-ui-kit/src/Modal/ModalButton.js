import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text } from 'react-native';

import styled from '../styled';

const Button = styled(
  ({ theme }) => ({
    width: theme.sizing.baseUnit * 3,
  }),
  'ui-kit.ModalButton.Button'
)(TouchableOpacity);

const ButtonText = styled(
  ({ theme }) => ({
    color: theme.colors.primary,
    fontSize: theme.typography.baseFontSize,
    lineHeight: theme.typography.baseLineHeight,
    textAlign: 'right',
  }),
  'ui-kit.ModalButton.ButtonText'
)(Text);

function ModalButton({ onPress, title }) {
  return (
    <Button onPress={onPress}>
      <ButtonText numberOfLines={1}>{title}</ButtonText>
    </Button>
  );
}

ModalButton.propTypes = {
  onPress: PropTypes.func,
  title: PropTypes.string,
};

export default ModalButton;
