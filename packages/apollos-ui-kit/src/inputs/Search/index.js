import React, { PureComponent } from 'react';
import { View, Animated, TextInput } from 'react-native';
// import Color from 'color';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';

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
 * + clear text icon
 * + cancel buttontext
 *   - text prop
 *   - onPress prop
 *   + animate cancel text in
 * + placeholder text prop
 * - onSubmit prop
 */

const SearchWrapper = styled(({ theme, disabled }) => ({
  overflow: 'hidden',
  ...(disabled ? { opacity: theme.alpha.medium } : {}),
}))(View);

const TextInputWrapper = styled(
  ({ theme }) => ({
    flexDirection: 'row',
    flexGrow: 1,
    alignItems: 'center',
    borderRadius: theme.sizing.baseUnit,
    backgroundColor: theme.colors.background.screen,
    overflow: 'hidden',
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

const Input = withTheme(({ theme }) => ({
  placeholderTextColor: theme.colors.text.tertiary,
  selectionColor: theme.colors.action.secondary,
  style: {
    flexGrow: 1, // fixes weird text behind icon (ios) and placeholder clipping (android) bugs
    height: theme.helpers.rem(2.5), // we have to have a height to make this display correctly. using typographic unit to scale with text size.
    paddingVertical: 0, // removes weird "default" padding
    paddingLeft: theme.sizing.baseUnit * 0.5,
    paddingRight: theme.sizing.baseUnit * 2.5,
    fontSize: theme.helpers.rem(0.875),
    fontFamily: theme.typography.sans.medium.default,
  },
}))(TextInput);

const ClearSearchIconBackground = styled(({ theme }) => ({
  marginRight: theme.sizing.baseUnit,
  borderTopRightRadius: theme.sizing.baseUnit,
  borderBottomRightRadius: theme.sizing.baseUnit,
  backgroundColor: theme.colors.background.screen,
  overflow: 'hidden', // fixes ios border radius bug
}))(View);

const ClearSearchIcon = withTheme(({ theme, isVisible }) => ({
  fill: theme.colors.text.tertiary,
  size: theme.helpers.rem(1),
  iconPadding: theme.helpers.rem(0.75),
  style: {
    opacity: isVisible ? 1 : 0,
  },
}))(ButtonIcon);

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
      showClearSearchIcon: false,
    };

    this.animatedValue = new Animated.Value(59); // 75

    this.animatedStyle = {
      position: 'absolute',
      height: '100%',
      right: 0,
      transform: [{ translateX: this.animatedValue }],
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
    };
  }

  componentDidUpdate() {
    if (this.state.isFocused) {
      Animated.spring(this.animatedValue, {
        toValue: 0,
        duration: 500,
        damping: 500,
        stiffness: 1000,
        mass: 3,
        useNativeDriver: true,
      }).start();
    }
    if (!this.state.isFocused) {
      Animated.spring(this.animatedValue, {
        toValue: 59,
        duration: 300,
        damping: 500,
        stiffness: 1000,
        mass: 3,
        useNativeDriver: true,
      }).start();
    }
  }

  handleOnFocus = () => {
    this.setState((state) => ({
      isFocused: !state.isFocused,
    }));
  };

  handleOnChangeText = (changedText) => {
    this.value = changedText;

    if (this.value !== '') {
      this.setState({
        showClearSearchIcon: true,
      });
    }
  };

  handleOnChangeText = (changedText) => {
    /* `onChangeText` triggers `handleOnChangeText` on EVERY text change. the logic that follows
     * optizies for rerenders.
     *
     * Only show the `ClearSearchIcon` if we have an input value */
    const shouldShowClearSearchIcon = changedText !== '';

    // check previous value (state) against current value (above)
    if (this.state.showClearSearchIcon !== shouldShowClearSearchIcon) {
      this.setState({
        showClearSearchIcon: shouldShowClearSearchIcon,
      });
    }
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
      <SearchWrapper style={wrapperStyle} disabled={disabled}>
        <TextInputWrapper>
          <LoopIcon name={'search'} isFocused={this.state.isFocused} />
          <Input
            ref={inputRef}
            editable={!disabled}
            defaultValue={value}
            onFocus={this.handleOnFocus}
            onBlur={this.handleOnFocus}
            onChangeText={this.handleOnChangeText}
            placeholder={placeholder}
            {...textInputProps}
          />
        </TextInputWrapper>

        <Animated.View style={this.animatedStyle}>
          <ClearSearchIconBackground isFocused={this.state.isFocused}>
            <ClearSearchIcon
              name={'close'}
              isVisible={this.state.showClearSearchIcon}
            />
          </ClearSearchIconBackground>

          <ButtonLink>Cancel</ButtonLink>
        </Animated.View>
      </SearchWrapper>
    );
  }
}

export default Search;
