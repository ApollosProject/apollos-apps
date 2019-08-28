import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Animated, Keyboard } from 'react-native';

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

class Search extends PureComponent {
  static propTypes = {
    cancelButtonText: PropTypes.string,
    disabled: PropTypes.bool,
    inputRef: PropTypes.node, // Need access to the search input? pass in your ref here!
    onSubmit: PropTypes.func,
    placeholder: PropTypes.string,
    /* In order for this components animation to work correctly you need match this value to this
     * components surroundings. You only need this if you are rendering `Search` on a color other
     * than theme.colors.background.paper. */
    screenBackgroundColor: PropTypes.string,
  };

  static defaultProps = {
    cancelButtonText: 'Cancel',
    disabled: false,
    placeholder: 'Search',
  };

  constructor(props) {
    super();

    this.inputRef = props.inputRef || React.createRef();
    this.cancelButtonWidth = 1000; // 🧙‍magic number ≈ arbiraty large number that forces `CancelButton` render off screen.

    // this animation shows and hides the `CancelButton`
    this.animatedSmokeAndMirrors = new Animated.Value(this.cancelButtonWidth);
    this.animatedSmokeAndMirrorsStyle = {
      // these styles are required to live here and are required for the animation to function
      position: 'absolute',
      height: '100%',
      right: 0,
      transform: [{ translateX: this.animatedSmokeAndMirrors }],
    };

    // this animation shows and hides the `ClearSearchButton`
    this.showClearSearchButton = false;
    this.animatedClearSearchButton = new Animated.Value(0);
    this.animatedClearSearchButtonStyle = {
      opacity: this.animatedClearSearchButton,
    };

    this.state = {
      isFocused: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    /* React Docs explicitly say these conditions should be here even though I never saw additonal rerenders
     * See 👉 https://reactjs.org/docs/react-component.html#componentdidupdate */
    if (this.state.isFocused && this.state.isFocused !== prevState.isFocused) {
      Animated.spring(this.animatedSmokeAndMirrors, {
        toValue: 0,
        // these values match the ios spring effect
        duration: 500,
        damping: 500,
        stiffness: 1000,
        mass: 3,
        useNativeDriver: true,
      }).start();
    }
    if (!this.state.isFocused && this.state.isFocused !== prevState.isFocused) {
      Animated.spring(this.animatedSmokeAndMirrors, {
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

  animateClearSearchButton = (isVisible) => {
    console.count('What');
    Animated.timing(this.animatedClearSearchButton, {
      toValue: isVisible ? 1 : 0,
      duration: 0,
    }).start();
  };

  handleOnFocus = () => {
    this.setState((state) => ({
      isFocused: !state.isFocused,
    }));
  };

  handleOnChangeText = (changedText) => {
    /* `onChangeText` triggers `handleOnChangeText` on EVERY text change. the logic that follows
     * optizies for rerenders. To do this we have to keep track of `showClearSearchButton` so that
     * we don't call `animateClearSearchButton` on every time.
     *
     * Only show the `ClearSearchButton` if we have an input value */
    const shouldShowClearSearchButton = changedText !== '';

    // check previous value against current value (above)
    if (this.showClearSearchButton !== shouldShowClearSearchButton) {
      this.animateClearSearchButton(shouldShowClearSearchButton);
      this.showClearSearchButton = shouldShowClearSearchButton;
    }
  };

  handleOnPressClearSearchButton = () => {
    this.inputRef.current.clear();
    this.animateClearSearchButton(false);
    this.showClearSearchButton = false;
  };

  handleOnPressCancel = () => Keyboard.dismiss();

  handleOnLayout = ({
    nativeEvent: {
      layout: { width },
    },
  }) => {
    // we dynamically set this value after render so we can be sure to always animate to the write place.
    this.cancelButtonWidth = width;
    this.animatedSmokeAndMirrors.setValue(this.cancelButtonWidth);
  };

  render() {
    const {
      cancelButtonText,
      disabled,
      inputRef,
      onSubmit,
      placeholder,
      screenBackgroundColor,
      ...textInputProps
    } = this.props;

    return (
      <SearchWrapper disabled={disabled}>
        <TextInputWrapper>
          <LoopIcon name={'search'} isFocused={this.state.isFocused} />
          <Input
            cancelButtonOffset={this.cancelButtonWidth} // used for styling
            forwardedRef={this.inputRef}
            editable={!disabled}
            isFocused={this.state.isFocused} // used for styling
            onFocus={this.handleOnFocus}
            onBlur={this.handleOnFocus}
            onChangeText={this.handleOnChangeText}
            onSubmitEditing={onSubmit}
            placeholder={placeholder}
            returnKeyType={'search'}
            {...textInputProps}
          />
        </TextInputWrapper>

        <Animated.View style={this.animatedSmokeAndMirrorsStyle}>
          <SmokeAndMirrorsWrapper screenBackgroundColor={screenBackgroundColor}>
            <ClearSearchButtonBackground isFocused={this.state.isFocused}>
              <Animated.View style={this.animatedClearSearchButtonStyle}>
                <ClearSearchButton
                  onPress={this.handleOnPressClearSearchButton}
                  name={'close'}
                />
              </Animated.View>
            </ClearSearchButtonBackground>

            <CancelButton
              onPress={this.handleOnPressCancel}
              onLayout={this.handleOnLayout}
            >
              {cancelButtonText}
            </CancelButton>
          </SmokeAndMirrorsWrapper>
        </Animated.View>
      </SearchWrapper>
    );
  }
}

export default Search;
