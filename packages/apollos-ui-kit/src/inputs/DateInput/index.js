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
          date={
            this.props.value
              ? moment(this.props.value).toDate()
              : moment(Date.now())
                  .subtract(18, 'years')
                  .toDate() // 18 years in the past, to ensure you don't have to change the year first on iOS
          } // Using Date.now so we have something to mock in the tests
          datePickerModeAndroid={'spinner'}
          isVisible={this.state.isVisible}
          maximumDate={
            this.props.maximumDate
              ? moment(this.props.maximumDate).toDate()
              : moment(Date.now())
                  .subtract(16, 'years')
                  .toDate() // sixteen year in the past to limit signups for 16 > year olds
          } // Using Date.now so we have something to mock in the tests
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
