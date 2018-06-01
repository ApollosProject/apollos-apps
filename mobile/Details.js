import React from 'react';
import { Button, Text, View } from 'react-native';
import PropTypes from 'prop-types';

const DetailsScreen = (props) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Details Screen</Text>
    <Button title="Go back" onPress={() => props.navigation.goBack()} />
  </View>
);

DetailsScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }),
};

export default DetailsScreen;
