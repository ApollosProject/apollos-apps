import React, { PureComponent } from 'react';
import { View, Animated, TextInput } from 'react-native';
// import Color from 'color';
import PropTypes from 'prop-types';

import styled from '../../styled';
import { withTheme } from '../../theme';
import Icon from '../../Icon';

// import InputWrapper from '../InputWrapper';
// import TextInput from '../Text';
import ErrorText from '../ErrorText';
import InputAddon, { AddonRow } from '../InputAddon';
// import { textStyle } from '../withInputControlStyles';

/*
 * search loop icon
 * clear text icon
 * cancel buttontext
 *   text prop
 *   onPress prop
 *   animate cancel text in
 * label text prop
 * onSubmit prop
 */

const InputWrapper = styled(
  ({ theme, disabled }) => ({
    paddingHorizontal: theme.sizing.baseUnit,
    borderRadius: theme.sizing.baseUnit,
    backgroundColor: theme.colors.background.screen,
    ...(disabled ? { opacity: 0.5 } : {}),
  }),
  'InputWrapper'
)(View);

const LoopIcon = withTheme(({ theme, isFocused }) => ({
  fill: isFocused ? theme.colors.action.secondary : theme.colors.text.tertiary,
  size: theme.sizing.baseUnit,
}))(Icon);

const Input = withTheme(({ theme }) => ({
  placeholderTextColor: theme.colors.text.tertiary,
  selectionColor: theme.colors.action.secondary,
  style: {
    paddingVertical: theme.sizing.baseUnit * 0.625,
    paddingLeft: theme.sizing.baseUnit * 0.5,
    fontSize: theme.helpers.rem(0.875),
    fontFamily: theme.typography.sans.medium.default,
  },
}))(TextInput);

class Search extends PureComponent {
  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.any, // eslint-disable-line
    wrapperStyle: PropTypes.any, // eslint-disable-line
    error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    disabled: PropTypes.bool,
    inputRef: PropTypes.func,
    underline: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
  };

  constructor() {
    super();

    this.state = {
      isFocused: false,
    };
  }

  handleOnFocus = () => {
    this.setState((state) => ({
      isFocused: !state.isFocused,
    }));
  };

  render() {
    const {
      label,
      value,
      wrapperStyle,
      error,
      disabled = false,
      inputRef,
      underline,
      ...textInputProps
    } = this.props;

    const focusAnimation = new Animated.Value(1);

    const animatedStyle = { opacity: focusAnimation, flex: 1 };

    return (
      <InputWrapper style={wrapperStyle} disabled={disabled}>
        <View>
          <AddonRow>
            <InputAddon>
              <LoopIcon name={'search'} isFocused={this.state.isFocused} />
            </InputAddon>
            <Animated.View style={animatedStyle}>
              <Input
                ref={inputRef}
                editable={!disabled}
                value={value}
                onFocus={this.handleOnFocus}
                onBlur={this.handleOnFocus}
                {...textInputProps}
              />
            </Animated.View>
          </AddonRow>
        </View>

        {error && typeof error === 'string' ? (
          <ErrorText>{error}</ErrorText>
        ) : null}
      </InputWrapper>
    );
  }
}

export default Search;
