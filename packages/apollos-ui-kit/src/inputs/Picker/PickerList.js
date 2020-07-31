import React from 'react';
import PropTypes from 'prop-types';
import { Modal, StyleSheet, View, Picker as NativePicker } from 'react-native';

import styled from '../../styled';
import { ButtonLink } from '../../Button';

const StyledPicker = styled(
  ({ theme }) => ({
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.background.inactive,
  }),
  'ui-kit.inputs.Picker.PickerList.StyledPicker'
)(NativePicker);

const PickerKeyboardView = styled(
  ({ theme }) => ({
    backgroundColor: theme.colors.background.paper,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopColor: theme.colors.shadows.default,
    borderTopWidth: StyleSheet.hairlineWidth,
  }),
  'ui-kit.inputs.Picker.PickerList.PickerKeyboardView'
)(View);

const Toolbar = styled(
  ({ theme }) => ({
    alignItems: 'flex-end',
    padding: theme.sizing.baseUnit / 2,
    backgroundColor: theme.colors.background.accent,
  }),
  'ui-kit.inputs.Picker.PickerList.Toolbar'
)(View);

const PickerList = ({ focused, onRequestClose, value, ...pickerProps }) => (
  <Modal
    visible={focused}
    onRequestClose={onRequestClose}
    animationType="slide"
    transparent
  >
    <PickerKeyboardView>
      <Toolbar>
        <ButtonLink onPress={onRequestClose}>Done</ButtonLink>
      </Toolbar>
      <StyledPicker selectedValue={value} {...pickerProps} />
    </PickerKeyboardView>
  </Modal>
);

PickerList.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.node,
  focused: PropTypes.bool,
  onRequestClose: PropTypes.func,
  mode: PropTypes.string,
};

export default PickerList;
