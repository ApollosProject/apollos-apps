import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

class StretchyView extends PureComponent {
  static propTypes = {
    children: PropTypes.func.isRequired,
  };

  StretchyPortal = ({ children, background = false, style }) => (
    <View style={[background ? StyleSheet.absoluteFill : null, style]}>
      {children}
    </View>
  );

  render() {
    return (
      <View style={StyleSheet.absoluteFill}>
        {this.props.children({
          Stretchy: this.StretchyPortal,
          scrollEventThrottle: null,
          onScroll: null,
        })}
      </View>
    );
  }
}

export default StretchyView;
