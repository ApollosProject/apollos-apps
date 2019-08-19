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
    // marginVertical: theme.sizing.baseUnit,
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
}))(TextInput);

class Search extends PureComponent {
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
      suffix,
      value,
      wrapperStyle,
      error,
      disabled = false,
      theme,
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
                // style={textStyle({ theme })}
                ref={inputRef}
                editable={!disabled}
                value={value}
                onFocus={this.handleOnFocus}
                onBlur={this.handleOnFocus}
              />
            </Animated.View>
            <InputAddon>{suffix}</InputAddon>
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
