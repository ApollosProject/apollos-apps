import React, { Component } from 'react';
import { View } from 'react-native';

class BottomSheetModal extends Component {
  present = jest.fn();

  expand = jest.fn();

  collapse = jest.fn();

  render() {
    return <View {...this.props} />;
  }
}

module.exports = {
  BottomSheetModalProvider: ({ children }) => children,
  BottomSheetModal,
};
