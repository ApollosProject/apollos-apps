import React, { PureComponent } from 'react';
import { View, Animated, TextInput } from 'react-native';
// import Color from 'color';
import PropTypes from 'prop-types';

import styled from '../../styled';
import { withTheme } from '../../theme';
import Icon from '../../Icon';
import { ButtonIcon, ButtonLink } from '../../Button';

// import InputWrapper from '../InputWrapper';
// import TextInput from '../Text';
import InputAddon, { AddonRow } from '../InputAddon';
// import { textStyle } from '../withInputControlStyles';

/*
 * + search loop icon
 * - clear text icon
 * - cancel buttontext
 *   - text prop
 *   - onPress prop
 *   - animate cancel text in
 * + placeholder text prop
 * - onSubmit prop
 */

const TextInputWrapper = styled(
  ({ theme, disabled }) => ({
    flexDirection: 'row',
    flexGrow: 1,
    alignItems: 'center',
    borderTopLeftRadius: theme.sizing.baseUnit,
    borderBottomLeftRadius: theme.sizing.baseUnit,
    // backgroundColor: theme.colors.background.screen,
    backgroundColor: 'salmon',
    ...(disabled ? { opacity: 0.5 } : {}),
  }),
  'InputWrapper'
)(View);

const LoopIcon = withTheme(({ theme, isFocused }) => ({
  fill: isFocused ? theme.colors.action.secondary : theme.colors.text.tertiary,
  size: theme.helpers.rem(1),
  style: {
    marginLeft: theme.sizing.baseUnit,
  },
}))(Icon);

const ClearIconBackground = styled(({ theme }) => ({
  // backgroundColor: theme.colors.background.screen,
  backgroundColor: 'salmon',
}))(View);

const ClearIcon = withTheme(({ theme, isFocused }) => ({
  fill: isFocused ? theme.colors.action.secondary : theme.colors.text.tertiary,
  size: theme.helpers.rem(1),
  iconPadding: theme.helpers.rem(1),
}))(ButtonIcon);

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

const Boom = styled(({ theme }) => ({
  width: 16,
  height: 48,
  borderTopRightRadius: theme.sizing.baseUnit,
  borderBottomRightRadius: theme.sizing.baseUnit,
  // backgroundColor: theme.colors.background.screen,
  backgroundColor: 'blue',
  marginRight: theme.sizing.baseUnit,
}))(View);

class Search extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    inputRef: PropTypes.func,
    placeholder: PropTypes.string,
    value: PropTypes.any, // eslint-disable-line
    wrapperStyle: PropTypes.any, // eslint-disable-line
  };

  static defaultProps = {
    disabled: false,
    placeholder: 'Search',
  };

  constructor() {
    super();

    this.state = {
      isFocused: false,
    };

    // this.focusAnimation = new Animated.Value(1);
    // const animatedStyle = { opacity: focusAnimation };

    this.animatedStyle = {
      flexDirection: 'row',
      alignItems: 'center',
    };
  }

  handleOnFocus = () => {
    this.setState((state) => ({
      isFocused: !state.isFocused,
    }));
  };

  render() {
    const {
      disabled,
      inputRef,
      placeholder,
      value,
      wrapperStyle,
      ...textInputProps
    } = this.props;

    return (
      <AddonRow>
        <TextInputWrapper style={wrapperStyle} disabled={disabled}>
          <LoopIcon name={'search'} isFocused={this.state.isFocused} />
          <Input
            ref={inputRef}
            editable={!disabled}
            value={value}
            onFocus={this.handleOnFocus}
            onBlur={this.handleOnFocus}
            placeholder={placeholder}
            {...textInputProps}
          />
        </TextInputWrapper>

        <Animated.View style={this.animatedStyle}>
          {this.state.isFocused ? (
            <ClearIconBackground>
              <ClearIcon name={'close'} />
            </ClearIconBackground>
          ) : null}
          <Boom />
          {this.state.isFocused ? <ButtonLink>Cancel</ButtonLink> : null}
        </Animated.View>
      </AddonRow>
    );
  }
}

export default Search;
