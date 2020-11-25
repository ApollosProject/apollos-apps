import Color from 'color';

const light = ({ colors, alpha }) => ({
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
      accent: Color(colors.lightTertiary).fade(alpha.medium).string(),
      inactive: colors.lightTertiary,
    },
    shadows: {
      default: Color(colors.black).fade(alpha.high).string(),
    },
    action: {
      default: colors.lightTertiary,
      primary: colors.primary,
      secondary: colors.secondary,
      tertiary: colors.tertiary,
    },
  },
  barStyle: 'dark-content',
});

export default light;
