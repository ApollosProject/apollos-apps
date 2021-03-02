import Color from 'color';

import fontStack from './fontStack';
import * as types from './types';

/**
 * There are two parts to a theme:
 * 1. The `input` that is used to generate a theme,
 * 2. The generated `theme` that is consumed by components
 *
 * The structure of both parts are essentially the same, except
 * with the generated `theme` having more detail.
 *
 * This file exposes the default values that are used in
 * theme generation that you might want to customize.
 *
 * To customize these values, provide theme as options in the `themeInput`
 * prop in <ThemeProvider>, like:
 * <ThemeProvider themeInput={{ colors: { primary: 'blue' }, type: 'dark' }} />
 *
 * For more detail on how to customize a theme, see (TODO: should be on storybook)
 */

// Base colors.
// These get used by theme types (see /types directory) to color
// specific parts of the interface. For more control on how certain
// elements are colored, go there. The next level of control comes
// on a per-component basis with "overrides"
export const colors = {
  primary: '#00676D',
  secondary: '#17B582',
  tertiary: '#6EC5B8',
  screen: '#F8F7F4',
  paper: '#FFFFFF',
  alert: '#c64f55',

  // Dark shades
  darkPrimary: '#303030',
  darkSecondary: '#505050',
  darkTertiary: '#A5A5A5',

  // Light shades
  lightPrimary: '#F8F7F4',
  lightSecondary: '#DBDBD9',
  lightTertiary: '#A5A5A5',

  // Statics
  black: '#000000',
  white: '#FFFFFF',
  transparent: 'transparent',
  wordOfChrist: '#8b0000', // only used in Scripture.
};

/* Base Typography sizing and fonts.
 *
 * To control speicfic styles used on different type components (like H1, H2, etc), see "overrides"
 */
export const typography = {
  baseFontSize: 16,
  baseLineHeight: 24, // 1.5 ratio
  ...fontStack,
};

// Responsive breakpoints
export const breakpoints = {
  xs: 320,
  sm: 496,
  md: 800,
  lg: 1200,
};

// Base sizing units. These are used to scale
// space, and size components relatively to one another.
export const sizing = {
  baseUnit: 16,
  baseBorderRadius: 16,
  avatar: {
    small: 40,
    medium: 80,
    large: 120,
  },
};

export const alpha = {
  high: 0.9,
  medium: 0.5,
  low: 0.4,
};

/**
 * Dynamic theme parts
 * The sections below define some of the dynamic
 * components to a theme. You can still override them,
 * but if you modify only the values above, the values below
 * will be updated to reflect your customizations.
 *
 * The available theme types get included into the theme, and the active theme type gets merged into
 * the theme. This allows for switching of theme values between different color palettes. The theme
 * types included by default are "light" and "dark". But, you could add your own theme types
 * (ex: "kids", with a more vibrant set of colors). Most of the colors that a component uses should
 * come from the active type, not from the base colors above. For example, notice below how
 * `shadows` gets the shadowColor from `colors.shadows`, which is provided by the active theme type.
 */
export const type = 'light';
export { types };

export const shadows = ({ colors: themeColors }) => ({
  default: {
    ios: {
      shadowColor: themeColors.shadows.default,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 1,
      shadowRadius: 8,
    },
    android: {
      elevation: 5,
    },
  },
  none: {
    ios: {
      shadowOpacity: 0,
    },
    android: {
      elevation: 0,
    },
  },
});

export const buttons = ({ colors: themeColors, alpha: themeAlpha }) => ({
  default: {
    fill: themeColors.action.default,
    accent: themeColors.text.primary,
  },
  primary: {
    fill: themeColors.action.primary,
    accent: themeColors.white,
  },
  secondary: {
    fill: themeColors.action.secondary,
    accent: themeColors.white,
  },
  tertiary: {
    fill: themeColors.action.tertiary,
    accent: themeColors.white,
  },
  ghost: {
    fill: themeColors.text.primary,
    accent: themeColors.text.primary,
  },
  overlay: {
    fill: Color(themeColors.white).alpha(themeAlpha.low).string(),
    accent: themeColors.white,
  },
  alert: {
    fill: themeColors.alert,
    accent: themeColors.white,
  },
});

export const overlays = ({
  alpha: themeAlpha,
  colors: themeColors,
  type: themeType,
}) => ({
  // these are a function because we can't assume colors of an overlay based on a theme (varies on usage + context)
  default: ({ overlayColor }) => ({
    colors: [`${Color(overlayColor).fade(1).string()}`, overlayColor],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
    locations: [0.5, 1],
  }),
  high: ({ overlayColor }) => ({
    colors: [
      `${Color(overlayColor).alpha(themeAlpha.high).string()}`,
      `${Color(overlayColor).alpha(themeAlpha.high).string()}`,
    ],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
    locations: [0, 1],
  }),
  medium: ({ overlayColor }) => ({
    colors: [
      `${Color(overlayColor).alpha(themeAlpha.medium).string()}`,
      `${Color(overlayColor).alpha(themeAlpha.medium).string()}`,
    ],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
    locations: [0, 1],
  }),
  low: ({ overlayColor }) => ({
    colors: [
      `${Color(overlayColor).alpha(themeAlpha.low).string()}`,
      `${Color(overlayColor).alpha(themeAlpha.low).string()}`,
    ],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
    locations: [0, 1],
  }),
  'gradient-bottom': ({ overlayColor }) => ({
    colors: [
      `${Color(overlayColor).alpha(themeAlpha.low).string()}`,
      `${Color(overlayColor).alpha(themeAlpha.medium).string()}`,
    ],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
    locations: [0, 1],
  }),
  'gradient-top': ({ overlayColor }) => ({
    colors: [
      `${Color(overlayColor).alpha(themeAlpha.medium).string()}`,
      themeColors.transparent,
    ],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
    locations: [0, 1],
  }),
  featured: ({ overlayColor }) => ({
    colors: [
      `${Color(overlayColor).alpha(themeAlpha.low).string()}`,
      overlayColor,
    ],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
    locations: [0, 0.8],
  }),
  // Overriding this property changes all BackgroundViews
  'background-gradient': ({ colors: customColors }) => ({
    colors: customColors || [
      themeType === 'dark'
        ? themeColors.background.screen
        : themeColors.background.paper,
      themeColors.background.screen,
    ],
    // default props from `react-native-linear-gradient`
    start: { x: 0.5, y: 0.0 },
    end: { x: 0.5, y: 1.0 },
    locations: null,
  }),
});

/*
 * Helpers make it easy to expose simple utils in your theme that rely on the current theme to
 * compute its value. They should be a function that takes a single argument - the current theme,
 * and returns a function that gets injected into the theme.
 */
export const helpers = {};

helpers.rem = (theme) => (units) => {
  const value = units * theme.typography.baseFontSize;
  return +value.toFixed(2);
};

/*
 * Vertical rhythm method of spacing objects (typically typographic elements) based on a predefined
 * ratio. A popular ratio that is often used would be something like the Golden Ratio. With the
 * Golden Ratio as an example, all elment spacing on the page is a multiplied derivitive of that
 * ratio resulting in a rhthmic spacing. This is often used in typography to set line heights and
 * vertical paddings. The helper function below takes a `rem` unit (often a font size but not always)
 * and multiplies it by either a custom ratio or a derrived ratio from the themes `baseLineHeight`
 * devided by the `baseFontSize`.
 */
helpers.verticalRhythm = (theme) => (units, customRatio) => {
  const verticalRatio =
    customRatio ||
    theme.typography.baseLineHeight / theme.typography.baseFontSize;
  return helpers.rem(theme)(verticalRatio * units);
};

/* Overrides allow you to override the styles of any component styled using the `styled` HOC. You
 * can also override the props of any component using the `withTheme` HOC. See examples below:
 * ```const StyledComponent = styled({ margin: 10, padding: 20 }, 'StyledComponent');
 *    const PropsComponent = withTheme(({ theme }) => ({ fill: theme.colors.primary }), 'PropsComponent');
 * ```
 * These componnents can have their styles/props overriden by including the following overrides:
 * ```{
 *   overides: {
 *     StyledComponent: {
 *       margin: 5,
 *       padding: 15,
 *     },
 *     // #protip: you even have access 👇to component props! This applies to style overrides too 💥
 *     PropsComponent: () => ({ theme, isActive }) => ({
 *       fill: isActive ? theme.colors.secondary : theme.colors.primary,
 *     }),
 *   },
 * }
 * ```
 */
export const overrides = {};
