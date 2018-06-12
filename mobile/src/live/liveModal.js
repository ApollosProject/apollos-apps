import React from 'react';
import { StyleSheet, WebView } from 'react-native';

const styles = StyleSheet.create({
  iframe: {
    width: '100%',
    height: '100%',
    borderWidth: 0,
  },
  noScroll: {
    overflow: 'hidden',
  },
});

const ModalScreen = () => (
  <WebView
    source={{ uri: 'https://apollos.churchonline.org/' }}
    style={{ styles }}
  />
);

export default ModalScreen;
