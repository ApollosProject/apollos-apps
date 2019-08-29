import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Animated, Keyboard } from 'react-native';

import { SearchWrapper, TextInputWrapper, LoopIcon, Input } from './styles';
import SearchActions from './SearchActions';

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
    value: PropTypes.string,
  };

  static defaultProps = {
    cancelButtonText: 'Cancel',
    disabled: false,
    placeholder: 'Search',
    value: '',
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

    this.state = {
      isFocused: false,
      value: '',
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

  handleOnFocus = () => {
    this.setState((state) => ({
      isFocused: !state.isFocused,
    }));
  };

  handleOnChangeText = (value) => {
    this.setState({ value });
  };

  handleOnPressClearSearchButton = () => {
    this.setState({
      value: '',
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
      value,
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
            value={this.state.value}
            {...textInputProps}
          />
        </TextInputWrapper>

        <Animated.View style={this.animatedSmokeAndMirrorsStyle}>
          <SearchActions
            cancelButtonText={cancelButtonText}
            isFocused={this.state.isFocused}
            onPressCancel={this.handleOnPressCancel}
            onLayout={this.handleOnLayout}
            onPressClearSearchButton={this.handleOnPressClearSearchButton}
            showClearSearchButton={this.state.value !== ''}
          />
        </Animated.View>
      </SearchWrapper>
    );
  }
}

export default Search;
