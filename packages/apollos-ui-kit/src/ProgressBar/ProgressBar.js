/**
 * ProgressBar.js
 *
 * Created: Jun 28, 2022
 *
 * Displays a bar that fills to indicate user progress.
 *
 * @example <caption>Fill 50% of the bar</caption>
 * <ProgressBar step={50} />
 *
 * @example <caption>Fill 100% of the bar</caption>
 * <ProgressBar step={100} />
 *
 * @example <caption>ProgressBar will fill the entirety of the container. In order to specify the width, contain the ProgressBar inside of a parent container with a set width</caption>
 * <View style={{ width: 100 }}>
 *  <ProgressBar step={20} />
 * </View>
 *
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { createStyles, calculateWidth } from './utils';

const ProgressBar = ({ step }) => {
  const theme = useTheme();

  // Generate our style sheet based on the current theme
  // We're using the React.useMemo hook for optimization,
  // the Styles object will be re-generated if the theme changes
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.bar}>
      <View
        style={StyleSheet.compose(styles.progress, {
          width: calculateWidth(step, theme),
        })}
      />
    </View>
  );
};

ProgressBar.propTypes = {
  /** the amount of the bar that should be full (between 0 and 100) */
  step: PropTypes.number,
};
ProgressBar.defaultProps = {
  step: 0,
};

export default ProgressBar;
