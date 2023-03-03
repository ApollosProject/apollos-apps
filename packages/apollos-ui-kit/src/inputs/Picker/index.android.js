import React from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-native';
import { Picker as NativePicker } from '@react-native-picker/picker';
import { mapProps } from 'recompose';

import InputUnderline from '../InputUnderline';
import InputWrapper from '../InputWrapper';
import FloatingLabel from '../FloatingLabel';

const MappedNativePicker = mapProps(
  ({ placeholder: prompt, value: selectedValue, ...otherProps }) => ({
    prompt,
    selectedValue,
    ...otherProps,
  })
)(NativePicker);

const Picker = ({ wrapperStyle, ...props }) => (
  <InputWrapper style={wrapperStyle}>
    <MappedNativePicker {...props} />
    <FloatingLabel animation={new Animated.Value(1)}>
      {props.label}
    </FloatingLabel>
    <InputUnderline />
  </InputWrapper>
);

Picker.propTypes = {
  label: PropTypes.string,
  wrapperStyle: PropTypes.any, // eslint-disable-line
};

export default Picker;
export const { Item } = NativePicker;
