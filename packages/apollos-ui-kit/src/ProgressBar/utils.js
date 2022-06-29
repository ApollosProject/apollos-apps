import { Platform, StyleSheet } from 'react-native';

/**
 * Returns the expected height of the progress bar
 * @param {Object} theme - Apollos Theme
 * @returns {number}
 */
export function progressBarHeight({ sizing }) {
  return sizing.baseUnit * 0.5;
}

/**
 * Creates the StyleSheet for the ProgressBar based on the current theme object
 * @param {Object} theme - Base Apollos Theme
 * @returns {Object}
 */
export function createStyles({ colors, sizing, shadows }) {
  const shadow = Platform.select(shadows.medium);
  const styleSheet = StyleSheet.create({
    bar: {
      flex: 1,
      borderRadius: progressBarHeight({ sizing }),
      backgroundColor: colors.background.system,
      ...shadow,
    },
    progress: {
      height: progressBarHeight({ sizing }),
      borderRadius: progressBarHeight({ sizing }),
      backgroundColor: colors.text.action,
    },
  });
  return styleSheet;
}

/**
 * Calculates the width of the progress bar. If the input is less than the height of the bar, then we will use the height to show "no" progress as a circle. We also cap the input to 100 as to not render outside of the container.
 * @param {number} input
 * @param {Object} theme - Apollos Theme Object
 * @returns {string}
 */
export function calculateWidth(input, { sizing }) {
  const min = progressBarHeight({ sizing });
  if (input < min) {
    return min;
  }

  if (input > 100) {
    return '100%';
  }

  return `${Math.round(input)}%`;
}
