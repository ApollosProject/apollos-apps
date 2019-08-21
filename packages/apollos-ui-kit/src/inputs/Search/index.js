import React, { PureComponent } from 'react';
import { View, Animated, TextInput, Dimensions } from 'react-native';
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
    // borderTopLeftRadius: theme.sizing.baseUnit,
    borderRadius: theme.sizing.baseUnit,
    // backgroundColor: theme.colors.background.screen,
    backgroundColor: 'salmon',
    ...(disabled ? { opacity: 0.5 } : {}),
    overflow: 'hidden',
    width: '100%', // Dimensions.get('window').width - theme.sizing.baseUnit * 3, // screen width - PaddedView - Boom
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

const ClearSearchIconBackground = styled(({ theme }) => ({
  marginRight: theme.sizing.baseUnit,
  zIndex: 1,
  overflow: 'hidden', // fixes ios border radius bug
  borderTopRightRadius: theme.sizing.baseUnit,
  borderBottomRightRadius: theme.sizing.baseUnit,
  backgroundColor: 'red',
  // backgroundColor: theme.colors.background.screen,
}))(View);

const ClearSearchIcon = withTheme(({ theme, isFocused }) => ({
  fill: theme.colors.text.tertiary,
  size: theme.helpers.rem(1),
  iconPadding: theme.helpers.rem(0.625),
  style: {
    opacity: isFocused ? 1 : 0,
  },
}))(ButtonIcon);

const Input = withTheme(({ theme }) => ({
  placeholderTextColor: theme.colors.text.tertiary,
  selectionColor: theme.colors.action.secondary,
  style: {
    // paddingVertical: theme.sizing.baseUnit * 0.625,
    paddingLeft: theme.sizing.baseUnit * 0.5,
    fontSize: theme.helpers.rem(0.875),
    fontFamily: theme.typography.sans.medium.default,
  },
}))(TextInput);

// const Boom = styled(({ theme, isFocused }) => ({
//   width: 16,
//   height: 40,
//   overflow: 'hidden', // fixes ios border radius bug
//   borderTopRightRadius: theme.sizing.baseUnit,
//   borderBottomRightRadius: theme.sizing.baseUnit,
//   backgroundColor: theme.colors.background.screen,
//   // backgroundColor: 'blue',
//   // marginRight: theme.sizing.baseUnit,
// }))(View);

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
      Animated.timing(this.animatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    if (!this.state.isFocused) {
      Animated.timing(this.animatedValue, {
        toValue: 59,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
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
      <View>
        <TextInputWrapper style={wrapperStyle} disabled={disabled}>
          <LoopIcon name={'search'} isFocused={this.state.isFocused} />
          <Input
            ref={inputRef}
            editable={!disabled}
            value={value}
            onFocus={this.handleOnFocus}
            onBlur={this.handleOnFocus}
            placeholder={placeholder}
            // clearButtonMode={'while-editing'}
            {...textInputProps}
          />
        </TextInputWrapper>

        <Animated.View style={this.animatedStyle}>
          <ClearSearchIconBackground>
            <ClearSearchIcon name={'close'} isFocused={this.state.isFocused} />
          </ClearSearchIconBackground>

          <ButtonLink>Cancel</ButtonLink>
        </Animated.View>
      </View>
    );
  }
}

export default Search;
