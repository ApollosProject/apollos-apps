import React, { PureComponent, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

import Stretchy from './Stretchy';

// https://mzl.la/2LP6mjP
// Comparison function to JSON.stringify that can handle
// circular references and ignores internal React properties.
const circular = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (key.startsWith('_')) {
      return undefined;
    } // Don't compare React's internal props.
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return undefined;
      }
      seen.add(value);
    }
    return value;
  };
};

class StretchyView extends PureComponent {
  static propTypes = {
    children: PropTypes.func.isRequired,
  };

  state = {
    stretchies: {},
    layoutHeight: Dimensions.get('window').height,
  };

  scrollY = new Animated.Value(0);

  handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
    { useNativeDriver: true }
  );

  handleLayout = ({
    nativeEvent: {
      layout: { height },
    },
  }) => {
    this.setState({ layoutHeight: height });
  };

  handleStretchyLayout = ({ stretchyKey, ...props }) => {
    this.setState(({ stretchies }) => ({
      stretchies: {
        ...stretchies,
        [stretchyKey]: { ...(stretchies[stretchyKey] || {}), ...props },
      },
    }));
  };

  StretchyPortal = ({
    children,
    stretchyKey = 'stretchy',
    stretchOn = 'top',
    background = false,
    style,
    ...otherProps
  }) => {
    const childrenAsComparableString = JSON.stringify(children, circular());

    // our linter isn't smart enough to detect that this is a functional component
    // eslint-disable-next-line
    useEffect(() => {
      if (this.state.stretchies[stretchyKey]) {
        this.handleStretchyLayout({
          stretchyKey,
          stretchOn,
          children,
          style,
          ...otherProps,
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [childrenAsComparableString]);

    return (
      <Animated.View
        onLayout={({ nativeEvent: { layout } }) =>
          this.handleStretchyLayout({
            stretchyKey,
            stretchOn,
            children,
            style,
            ...otherProps,
            ...layout,
          })
        }
        style={[
          { opacity: this.getStretchyPortalOpacity(stretchyKey) },
          background ? StyleSheet.absoluteFill : null,
          style,
        ]}
      >
        {children}
      </Animated.View>
    );
  };

  getStretchyPortalOpacity = (key) => {
    if (!this.state.stretchies[key]) {
      return 1;
    }
    const { stretchOn, y, height } = this.state.stretchies[key];

    if (stretchOn === 'top') {
      return this.scrollY.interpolate({
        inputRange: [y - 0.1, y, y + 0.1],
        outputRange: [0, 1, 1],
      });
    }

    if (stretchOn === 'bottom') {
      return this.scrollY.interpolate({
        inputRange: [
          y + height - this.state.layoutHeight - 0.1,
          y + height - this.state.layoutHeight,
          y + height - this.state.layoutHeight + 0.1,
        ],
        outputRange: [1, 1, 0],
      });
    }

    return 1;
  };

  render() {
    const { children, ...otherProps } = this.props;

    return (
      <View
        style={StyleSheet.absoluteFill}
        {...otherProps}
        onLayout={this.handleLayout}
      >
        {Object.keys(this.state.stretchies).map((key) => (
          <Stretchy
            key={key}
            layoutHeight={this.state.layoutHeight}
            scrollY={this.scrollY}
            {...this.state.stretchies[key]}
          />
        ))}
        {children({
          scrollEventThrottle: 16,
          onScroll: this.handleScroll,
          Stretchy: this.StretchyPortal,
        })}
      </View>
    );
  }
}

export default StretchyView;
