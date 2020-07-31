import React, { PureComponent } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import { compose, getContext } from 'recompose';
import isString from 'lodash/isString';

import { H6 } from '../../typography';
import styled from '../../styled';

import RadioButtonIndicator from './RadioButtonIndicator';

const Row = styled(
  ({ theme, underline }) => ({
    padding: theme.sizing.baseUnit / 2,
    borderBottomWidth: underline ? 1 : 0,
    borderBottomColor: theme.colors.background.accent,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
  'ui-kit.inputs.Radio.RadioButton.Row'
)(View);

class RadioButton extends PureComponent {
  static propTypes = {
    underline: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    currentValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
      PropTypes.func,
    ]),
    onSelectValue: PropTypes.func,
    RadioButtonIndicator: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func,
    ]),
  };

  static defaultProps = {
    underline: true,
    label: '',
    onSelectValue() {},
    RadioButtonIndicator,
  };

  handleOnPress = () => {
    this.props.onSelectValue(this.props.value);
  };

  render() {
    const Indicator = this.props.RadioButtonIndicator;
    return (
      <TouchableWithoutFeedback onPress={this.handleOnPress}>
        <Row underline={this.props.underline}>
          <Indicator
            isSelected={this.props.currentValue === this.props.value}
          />
          {isString(this.props.label) ? (
            <H6>{this.props.label}</H6>
          ) : (
            <this.props.label />
          )}
        </Row>
      </TouchableWithoutFeedback>
    );
  }
}

const enhance = compose(
  getContext({
    onSelectValue: PropTypes.func,
    currentValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })
);

export default enhance(RadioButton);
