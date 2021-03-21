import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { compose, withProps, pure } from 'recompose';
import { View, Platform, TextInput, Animated } from 'react-native';
import Color from 'color';

import { withTheme } from '../../theme';

import FloatingLabel from '../FloatingLabel';
import InputUnderline from '../InputUnderline';
import InputWrapper from '../InputWrapper';
import ErrorText from '../ErrorText';
import withFocusAnimation from '../withFocusAnimation';
import InputAddon, { AddonRow, TextInputWrapper } from '../InputAddon';
import { textStyle } from '../withInputControlStyles';

const propsForInputType = {
  password: {
    secureTextEntry: true,
    autoCapitalize: 'none',
    autoCorrect: false,
  },
  email: {
    keyboardType: 'email-address',
    autoCapitalize: 'none',
    autoCorrect: false,
  },
  numeric: {
    keyboardType: 'numeric',
  },
  numericKeyboard: {
    ...Platform.select({
      ios: { keyboardType: 'numeric' },
      android: { keyboardType: 'numeric' },
      web: { type: 'text' },
    }),
  },
  phone: {
    keyboardType: 'phone-pad',
  },
  date: {
    ...Platform.select({
      ios: { keyboardType: 'numeric' },
      android: { keyboardType: 'numeric' },
      web: { type: 'date' },
    }),
  },
};

const enhance = compose(
  pure,
  withTheme(),
  withFocusAnimation,
  withProps(({ type, ...props }) => ({
    ...get(propsForInputType, type, {}),
    ...props,
  }))
);

const Text = enhance(
  ({
    label,
    labelColor,
    prefix,
    suffix,
    value,
    wrapperStyle,
    floatingLabelStyle,
    inputAddonStyle,
    error,
    disabled = false,
    theme,
    inputRef,
    focusAnimation: focusAnimationInput, // from withFocusAnimation
    underline,
    style,
    component,
    TextInputComponent = TextInput,
    ...textInputProps
  }) => {
    const focusAnimation =
      value || !label ? new Animated.Value(1) : focusAnimationInput;
    const animatedStyle = { opacity: focusAnimation };

    return (
      <InputWrapper style={wrapperStyle} disabled={disabled}>
        <View>
          <AddonRow>
            <InputAddon style={inputAddonStyle}>{prefix}</InputAddon>
            <TextInputWrapper>
              <Animated.View style={animatedStyle}>
                <TextInputComponent
                  style={[textStyle({ theme }), style]}
                  ref={inputRef}
                  placeholderTextColor={Color(theme.colors.text.primary)
                    .fade(theme.alpha.low)
                    .string()}
                  {...textInputProps}
                  editable={!disabled}
                  value={value}
                />
              </Animated.View>
              <FloatingLabel
                style={floatingLabelStyle}
                color={labelColor}
                animation={focusAnimation}
              >
                {label}
              </FloatingLabel>
            </TextInputWrapper>
            <InputAddon>{suffix}</InputAddon>
          </AddonRow>
          {underline ? (
            <InputUnderline
              animation={focusAnimation}
              hasError={Boolean(error)}
            />
          ) : null}
        </View>

        {error && typeof error === 'string' ? (
          <ErrorText>{error}</ErrorText>
        ) : null}
      </InputWrapper>
    );
  }
);

Text.defaultProps = {
  returnKeyType: 'done',
  underlineColorAndroid: 'transparent',
  underline: true,
};

Text.propTypes = {
  disabled: PropTypes.bool,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  label: PropTypes.string,
  labelColor: PropTypes.string,
  value: PropTypes.any, // eslint-disable-line
  wrapperStyle: PropTypes.any, // eslint-disable-line
  inputAddonStyle: PropTypes.any, // eslint-disable-line
  floatingLabelStyle: PropTypes.any, // eslint-disable-line
  style: PropTypes.any, // eslint-disable-line
  returnKeyType: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  underlineColorAndroid: PropTypes.string,
  inputRef: PropTypes.func,
  underline: PropTypes.bool,
  TextInputComponent: PropTypes.any, // eslint-disable-line
};

export default Text;
