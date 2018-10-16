import React, { createContext, Component } from 'react';
import { Dimensions, StyleSheet, SafeAreaView, View } from 'react-native';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';

const initialDimensions = Dimensions.get('screen');

const styles = StyleSheet.create({
  flex: { flex: 1 },
});

const initialState = {
  safeAreaInsets: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
};

const Context = createContext(initialState);

const LayoutConsumer = Context.Consumer;

class LayoutProvider extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  state = initialState;

  rootHeight = initialDimensions.height;

  rootWidth = initialDimensions.width;

  handleRootLayout = ({
    nativeEvent: {
      layout: { height, width },
    },
  }) => {
    this.rootHeight = height;
    this.rootWidth = width;
  };

  handleChildLayout = ({
    nativeEvent: {
      layout: { x, y, width, height },
    },
  }) => {
    const safeAreaInsets = {
      top: y,
      bottom: this.rootHeight - height - y,
      left: x,
      right: this.rootWidth - width - x,
    };

    if (!isEqual(this.state.safeAreaInsets, safeAreaInsets)) {
      this.setState({ safeAreaInsets }); // eslint-disable-line
    }
  };

  render() {
    return (
      <SafeAreaView
        style={StyleSheet.absoluteFill}
        onLayout={this.handleRootLayout}
      >
        <View style={styles.flex} onLayout={this.handleChildLayout} />
        <View style={StyleSheet.absoluteFill}>
          <Context.Provider value={this.state}>
            {this.props.children}
          </Context.Provider>
        </View>
      </SafeAreaView>
    );
  }
}

export { LayoutProvider, LayoutConsumer };
