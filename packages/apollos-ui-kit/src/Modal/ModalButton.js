import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text } from 'react-native';

import styled from '../styled';

const Button = styled(
  ({ theme }) => ({
    minWidth: theme.sizing.baseUnit * 3,
  }),
  'ui-kit.ModalButton.Button'
)(TouchableOpacity);

const ButtonText = styled(
  ({ theme, strong = false }) => ({
    color: theme.colors.secondary,
    fontSize: theme.typography.baseFontSize,
    lineHeight: theme.typography.baseLineHeight,
    textAlign: 'right',
    fontWeight: strong ? 'bold' : undefined,
  }),
  'ui-kit.ModalButton.ButtonText'
)(Text);

function ModalButton({ onPress, title, strong }) {
  return (
    <Button onPress={onPress}>
      <ButtonText numberOfLines={1} strong={strong}>
        {title}
      </ButtonText>
    </Button>
  );
}

ModalButton.propTypes = {
  onPress: PropTypes.func,
  title: PropTypes.string,
  strong: PropTypes.bool,
};

export default ModalButton;
