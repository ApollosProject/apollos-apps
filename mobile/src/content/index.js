import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class Content extends React.Component {
  static navigationOptions = {
    title: 'Content',
  };
  render() {
    return (
      <View style={styles.container}>
        <Text>Content List</Text>
      </View>
    );
  }
}

export default Content;
