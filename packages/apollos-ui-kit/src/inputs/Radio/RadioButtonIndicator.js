import React, { PureComponent } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import styled from '../../styled';

const OutlinedCircle = styled(
  ({ theme, isSelected }) => ({
    height: theme.sizing.baseUnit * 1.25,
    width: theme.sizing.baseUnit * 1.25,
    borderRadius: theme.sizing.baseUnit * 0.625,
    borderWidth: 2,
    borderColor: isSelected ? theme.colors.primary : theme.colors.darkTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  'ui-kit.inputs.Radio.RadioButtonIndicator.OutlinedCircle'
)(View);

const FilledCircle = styled(
  ({ theme }) => ({
    height: theme.sizing.baseUnit * 0.75,
    width: theme.sizing.baseUnit * 0.75,
    borderRadius: theme.sizing.baseUnit * 0.625,
    backgroundColor: theme.colors.primary,
  }),
  'ui-kit.inputs.Radio.RadioButtonIndicator.FilledCircle'
)(View);

class RadioButtonIndicator extends PureComponent {
  static propTypes = {
    isSelected: PropTypes.bool,
  };

  static defaultProps = {
    isSelected: false,
  };

  render() {
    if (this.props.isSelected) {
      return (
        <OutlinedCircle isSelected>
          <FilledCircle />
        </OutlinedCircle>
      );
    }
    return <OutlinedCircle />;
  }
}

export default RadioButtonIndicator;
