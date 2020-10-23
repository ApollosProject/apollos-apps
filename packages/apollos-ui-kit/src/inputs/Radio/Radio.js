import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import styled from '../../styled';
import ErrorText from '../ErrorText';

import RadioButton from './RadioButton';

const ErrorWrapper = styled(
  {
    alignSelf: 'stretch',
    width: '100%',
  },
  'ui-kit.inputs.Radio.Radio.ErrorWrapper'
)(View);

class Radio extends Component {
  static Button = RadioButton;

  static propTypes = {
    children: PropTypes.node,
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    style: PropTypes.any, // eslint-disable-line
    error: PropTypes.any, // eslint-disable-line
  };

  static childContextTypes = {
    onSelectValue: PropTypes.func,
    currentValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  static defaultProps = {
    children: null,
    onChange() {},
    value: null,
  };

  state = {
    value: this.props.value,
  };

  getChildContext() {
    return {
      onSelectValue: this.selectValue,
      currentValue: this.state.value,
    };
  }

  componentDidUpdate(lastProps) {
    if (lastProps.value !== this.props.value) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(
        {
          value: this.props.value,
        },
        this.notifyValueChanged
      );
    }
  }

  selectValue = (value) => {
    this.setState(
      {
        value,
      },
      this.notifyValueChanged
    );
  };

  notifyValueChanged = () => {
    this.props.onChange(this.state.value);
  };

  render() {
    return (
      <View style={this.props.style}>
        {this.props.children}
        {this.props.error && typeof this.props.error === 'string' ? (
          <ErrorWrapper>
            <ErrorText>{this.props.error}</ErrorText>
          </ErrorWrapper>
        ) : null}
      </View>
    );
  }
}

export default Radio;
