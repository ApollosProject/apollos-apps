import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Animated, Platform } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';

import Chip from '../../Chip';
import styled from '../../styled';

import InputWrapper from '../InputWrapper';
import FloatingLabel from '../FloatingLabel';
import ErrorText from '../ErrorText';
import { withTheme } from '../../theme';

const StyledChip = styled(
  { marginTop: 5 },
  'ui-kit.inputs.DateInput.StyledChip'
)(Chip);
const StyledDateTimePicker = withTheme(
  ({
    theme: {
      colors: { text },
    },
  }) => ({
    textColor: text.primary,
  }),
  'ui-kit.inputs.DateInput.StyledDateTimePicker'
)(DateTimePicker);

class DateInput extends PureComponent {
  static propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.any, // eslint-disable-line
    displayValue: PropTypes.string,
    onChange: PropTypes.func,
    onChangeText: PropTypes.func,
    onBlur: PropTypes.func,
    error: PropTypes.any, // eslint-disable-line
    minimumDate: PropTypes.any, // eslint-disable-line
    maximumDate: PropTypes.any, // eslint-disable-line
  };

  state = {
    isVisible: false,
  };

  handleOpen = () => this.setState({ isVisible: true });

  handleClose = () => {
    this.setState({ isVisible: false });
    if (this.props.onBlur) this.props.onBlur();
  };

  handleConfirm = (value) => {
    if (this.props.onChange) this.props.onChange(value);
    if (this.props.onChangeText) {
      this.props.onChangeText(moment(value).format('MM/DD/YYYY'));
    }
    this.handleClose();
  };

  yearsAgo = (yearsToSubtract) => {
    const date = Date.now();
    date.setFullYear(date.getFullYear() - yearsToSubtract);
    // we want a date without a time (only has the TZ offset)
    const cleanDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    return cleanDate;
  };

  render() {
    return (
      <InputWrapper>
        <StyledChip
          title={
            this.props.displayValue ||
            this.props.placeholder ||
            this.props.label
          }
          onPress={this.handleOpen}
        />
        <StyledDateTimePicker
          // slightly higher than the max so you can adjust the day or month before the year
          date={this.props.value || this.yearsAgo(17)}
          datePickerModeAndroid={'spinner'}
          isVisible={this.state.isVisible}
          maximumDate={this.props.maximumDate || this.yearsAgo(16)}
          minimumDate={this.props.minimumDate}
          mode={'date'}
          display={Platform.OS === 'android' ? 'calendar' : 'spinner'}
          onConfirm={this.handleConfirm}
          onCancel={this.handleClose}
        />
        {this.props.displayValue || this.props.placeholder ? (
          <FloatingLabel animation={new Animated.Value(1)}>
            {this.props.label}
          </FloatingLabel>
        ) : null}
        {this.props.error && typeof this.props.error === 'string' ? (
          <ErrorText>{this.props.error}</ErrorText>
        ) : null}
      </InputWrapper>
    );
  }
}

export default withTheme(() => ({}), 'ui-kit.inputs.DateInput')(DateInput);
