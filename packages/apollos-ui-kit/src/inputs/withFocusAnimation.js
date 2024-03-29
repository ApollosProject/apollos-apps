import React, { PureComponent } from 'react';
import { Animated, Easing } from 'react-native';
import PropTypes from 'prop-types';

// helper HOC to wrap an Input in a floating label and animated underline
const withFocusAnimation = (Component) =>
  class WrappedInput extends PureComponent {
    _focusAnimation = new Animated.Value(0);

    static propTypes = {
      focusAnimation: PropTypes.any, // eslint-disable-line
      focusAnimationDuration: PropTypes.number,
      focusAnimationEasing: PropTypes.func,
      onFocus: PropTypes.func,
      onBlur: PropTypes.func,
      value: PropTypes.any, // eslint-disable-line
    };

    static defaultProps = {
      focusAnimationDuration: 450,
      focusAnimationEasing: Easing.in(Easing.bezier(0.23, 1, 0.32, 1)),
    };

    get focusAnimation() {
      return this.props.focusAnimation || this._focusAnimation;
    }

    playAnimation = (toValue) => {
      Animated.timing(this.focusAnimation, {
        toValue,
        duration: this.props.focusAnimationDuration,
        easing: this.props.focusAnimationEasing,
        useNativeDriver: true,
      }).start();
    };

    handleFocus = (...args) => {
      if (this.props.onFocus) {
        this.props.onFocus(...args);
      }
      this.focused = true;
      this.playAnimation(1);
    };

    handleBlur = (event, ...other) => {
      if (this.props.onBlur) {
        this.props.onBlur(event, ...other);
      }
      this.focused = false;
      if (!event.nativeEvent.text) {
        this.playAnimation(0);
      }
    };

    render() {
      const {
        focusAnimationDuration,
        focusAnimationEasing,
        ...otherProps
      } = this.props;
      return (
        <Component
          {...otherProps}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          focusAnimation={this.focusAnimation}
        />
      );
    }
  };

export default withFocusAnimation;
