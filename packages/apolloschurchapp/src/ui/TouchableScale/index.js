import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, TouchableWithoutFeedback } from 'react-native';

class TouchableScale extends Component {
  static propTypes = {
    minScale: PropTypes.number,
  };

  static defaultProps = {
    minScale: 0.95,
  };

  scale = new Animated.Value(1);

  animatedStyle = {
    transform: [{ scale: this.scale }],
  };

  handlePressIn = () => {
    Animated.spring(this.scale, {
      toValue: this.props.minScale,
      useNativeDriver: true,
    }).start();
  };

  handlePressOut = () => {
    Animated.spring(this.scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  render() {
    const { minScale, style, children, ...touchableProps } = this.props;
    return (
      <TouchableWithoutFeedback
        {...touchableProps}
        onPressIn={this.handlePressIn}
        onPressOut={this.handlePressOut}
      >
        <Animated.View style={[this.animatedStyle, style]}>
          {children}
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

export default TouchableScale;
