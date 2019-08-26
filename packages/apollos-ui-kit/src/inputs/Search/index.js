import React, { PureComponent } from 'react';
import { Animated, Keyboard } from 'react-native';
import PropTypes from 'prop-types';

import { UIText } from '../../typography';

import {
  SearchWrapper,
  TextInputWrapper,
  LoopIcon,
  Input,
  SmokeAndMirrorsWrapper,
  ClearSearchButtonBackground,
  ClearSearchButton,
  CancelButton,
} from './styles';
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

class Search extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    inputRef: PropTypes.node, // need access to the search input? pass in your ref here!
    placeholder: PropTypes.string,
    screenBackgroundColor: PropTypes.string, // in order for this components animation to work correctly you need match this value to this components surroundings.
    wrapperStyle: PropTypes.any, // eslint-disable-line
  };

  static defaultProps = {
    disabled: false,
    placeholder: 'Search',
  };

  constructor(props) {
    super();

    this.inputRef = props.inputRef || React.createRef();
    this.cancelButtonWidth = 1000; // 🧙‍magic number ≈ arbiraty large number that makes it `CancelButton` render off screen.
    this.animatedValue = new Animated.Value(this.cancelButtonWidth); // 75

    this.animatedStyle = {
      // these styles are required to live here and are required for the animation to function
      position: 'absolute',
      height: '100%',
      right: 0,
      transform: [{ translateX: this.animatedValue }],
    };

    this.state = {
      isFocused: false,
      showClearSearchButton: false,
    };
  }

  componentDidUpdate() {
    if (this.state.isFocused) {
      Animated.spring(this.animatedValue, {
        toValue: 0,
        // these values match the ios spring effect
        duration: 500,
        damping: 500,
        stiffness: 1000,
        mass: 3,
        useNativeDriver: true,
      }).start();
    }
    if (!this.state.isFocused) {
      Animated.spring(this.animatedValue, {
        toValue: this.cancelButtonWidth,
        // these values match the ios spring effect
        duration: 300,
        damping: 500,
        stiffness: 1000,
        mass: 3,
        useNativeDriver: true,
      }).start();
    }
  }

  handleOnFocus = () => {
    this.setState({
      isFocused: this.inputRef.current.isFocused(),
    });
  };

  handleOnChangeText = (changedText) => {
    /* `onChangeText` triggers `handleOnChangeText` on EVERY text change. the logic that follows
     * optizies for rerenders.
     *
     * Only show the `ClearSearchButton` if we have an input value */
    const shouldShowClearSearchButton = changedText !== '';

    // check previous value (state) against current value (above)
    if (this.state.showClearSearchButton !== shouldShowClearSearchButton) {
      this.setState({
        showClearSearchButton: shouldShowClearSearchButton,
      });
    }
  };

  handleOnPressClearSearchButton = () => {
    this.inputRef.current.clear();
    this.setState({
      showClearSearchButton: false,
    });
  };

  handleOnPressCancel = () => Keyboard.dismiss();

  handleOnLayout = ({
    nativeEvent: {
      layout: { width },
    },
  }) => {
    // we dynamically set this value after render so we can be sure to always animate to the write place.
    this.cancelButtonWidth = width;
  };

  render() {
    const {
      disabled,
      inputRef,
      placeholder,
      screenBackgroundColor,
      wrapperStyle,
      ...textInputProps
    } = this.props;

    return (
      <SearchWrapper style={wrapperStyle} disabled={disabled}>
        <TextInputWrapper>
          <LoopIcon name={'search'} isFocused={this.state.isFocused} />
          <Input
            forwardedRef={this.inputRef}
            editable={!disabled}
            onFocus={this.handleOnFocus}
            onBlur={this.handleOnFocus}
            onChangeText={this.handleOnChangeText}
            placeholder={placeholder}
            returnKeyType={'search'}
            // thesse are used for styles
            showClearSearchButton={this.state.showClearSearchButton}
            cancelButtonOffset={this.cancelButtonWidth}
            {...textInputProps}
          />
        </TextInputWrapper>

        <Animated.View style={this.animatedStyle}>
          <SmokeAndMirrorsWrapper screenBackgroundColor={screenBackgroundColor}>
            <ClearSearchButtonBackground isFocused={this.state.isFocused}>
              <ClearSearchButton
                onPress={this.handleOnPressClearSearchButton}
                name={'close'}
                isVisible={this.state.showClearSearchButton}
              />
            </ClearSearchButtonBackground>

            <UIText onLayout={this.handleOnLayout}>
              <CancelButton onPress={this.handleOnPressCancel}>
                Cancel
              </CancelButton>
            </UIText>
          </SmokeAndMirrorsWrapper>
        </Animated.View>
      </SearchWrapper>
    );
  }
}

export default Search;
