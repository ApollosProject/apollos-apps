import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, TouchableWithoutFeedback } from 'react-native';

class TouchableScale extends Component {
  static propTypes = {
    active: PropTypes.bool,
    children: PropTypes.any, // eslint-disable-line
    minScale: PropTypes.number,
    onPress: PropTypes.func,
    springConfig: PropTypes.shape({}),
    style: PropTypes.any, // eslint-disable-line
  };

  static defaultProps = {
    minScale: 0.95,
    springConfig: {
      speed: 20,
    },
  };

  constructor(props) {
    super();

    this.scale = new Animated.Value(props.active ? props.minScale : 1);

    this.animatedStyle = {
      transform: [{ scale: this.scale }],
    };
  }

  handlePressIn = () => {
    Animated.spring(this.scale, {
      toValue: this.props.minScale,
      useNativeDriver: true,
      isInteraction: false,
      ...this.props.springConfig,
    }).start();
  };

  handlePressOut = () => {
    Animated.spring(this.scale, {
      toValue: 1,
      useNativeDriver: true,
      isInteraction: false,
      ...this.props.springConfig,
    }).start();
  };

  render() {
    const {
      minScale,
      style,
      children,
      onPress,
      ...touchableProps
    } = this.props;

    const animationHandlers = onPress // fixes animation firing when there is no onPress function
      ? {
          onPress,
          onPressIn: this.handlePressIn,
          onPressOut: this.handlePressOut,
        }
      : {};

    return (
      <TouchableWithoutFeedback {...touchableProps} {...animationHandlers}>
        <Animated.View style={[this.animatedStyle, style]}>
          {children}
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

export default TouchableScale;
