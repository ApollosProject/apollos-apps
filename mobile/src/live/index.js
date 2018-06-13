import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 1,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  },
});

const LiveNowButton = (props) => (
  <View style={styles.container}>
    <TouchableOpacity
      style={styles.button}
      onPress={() => props.navigation.navigate('LiveNowModal')}
    >
      <Text> Live Now! </Text>
    </TouchableOpacity>
  </View>
);

LiveNowButton.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

export default LiveNowButton;
