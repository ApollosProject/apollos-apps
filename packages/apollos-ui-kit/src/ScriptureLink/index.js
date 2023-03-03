import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';

const ScriptureLink = ({ verse, children }) => {
  const navigation = useNavigation();
  const theme = useTheme();
  return (
    <Text
      style={styles.buttonLink(theme)}
      onPress={() => {
        navigation.navigate('Scripture', { reference: verse });
      }}
    >
      {children}
    </Text>
  );
};

ScriptureLink.propTypes = {
  verse: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const styles = StyleSheet.create({
  buttonLink: ({ colors }) => ({
    color: colors.text.link,
    textTransform: 'capitalize',
    textDecorationLine: 'underline',
  }),
});

export default ScriptureLink;
