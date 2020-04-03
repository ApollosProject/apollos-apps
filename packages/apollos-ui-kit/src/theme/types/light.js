import Color from 'color';

const light = ({ barStyle, colors, alpha }) => ({
  colors: {
    text: {
      primary: colors.darkPrimary,
      secondary: colors.darkSecondary,
      tertiary: colors.darkTertiary,
      link: colors.secondary,
    },
    background: {
      screen: colors.screen,
      paper: colors.paper,
      secondary: colors.paper,
      accent: Color(colors.lightTertiary)
        .fade(alpha.medium)
        .string(),
      inactive: colors.lightTertiary,
    },
    shadows: {
      default: Color(colors.darkTertiary)
        .fade(alpha.low)
        .string(),
    },
    action: {
      default: colors.lightTertiary,
      primary: colors.primary,
      secondary: colors.secondary,
      tertiary: colors.tertiary,
    },
  },
  barStyle,
});

export default light;
