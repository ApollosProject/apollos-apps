import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Color from 'color';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../theme';
import Icon from '../Icon';

const styles = StyleSheet.create({
  linearGradient: ({ size }) => ({
    borderRadius: size / 4.1875,
    alignItems: 'center',
    justifyContent: 'center',
    width: size,
    height: size,
  }),
});

const AppIcon = ({ size = 32, style, ...otherProps } = {}) => {
  const theme = useTheme();
  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={[
        Color(theme.colors.primary).lighten(0.4).saturate(0.4).toString(),
        theme.colors.primary,
      ]}
      style={[styles.linearGradient({ size }), style]}
      {...otherProps}
    >
      <Icon name="brand-icon" size={size / 2} fill="white" />
    </LinearGradient>
  );
};

AppIcon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.any,
};

export default AppIcon;
