import React from 'react';
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

const LoopIcon = withTheme(({ theme }) => ({
  fill: theme.colors.text.tertiary,
  size: theme.sizing.baseUnit,
}))(Icon);

const Input = withTheme(({ theme }) => ({
  placeholderTextColor: theme.colors.text.tertiary,
}));

const Search = ({
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
}) => {
  const focusAnimation = new Animated.Value(1);

  const animatedStyle = { opacity: focusAnimation, flex: 1 };

  return (
    <InputWrapper style={wrapperStyle} disabled={disabled}>
      <View>
        <AddonRow>
          <InputAddon>
            <LoopIcon name={'search'} />
          </InputAddon>
          <Animated.View style={animatedStyle}>
            <Input
              // style={textStyle({ theme })}
              ref={inputRef}
              editable={!disabled}
              value={value}
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
};
export default Search;
