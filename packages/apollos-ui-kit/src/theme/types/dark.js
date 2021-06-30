import Color from 'color';

const dark = ({ colors, alpha }) => ({
  colors: {
    // Screen and paper on the root theme are deprecated
    // These exist only for backwards compatibility.
    paper: colors.paper || '#1C1C1E',
    screen: colors.screen || colors.black || '#000000',

    neutral: {
      gray: colors.gray,
      // TODO: these colors should really be "generated" off of colors.gray
      gray2: '#636366',
      gray3: '#636366',
      gray4: '#3A3A3C',
      gray5: '#2C2C2E',
      gray6: '#1C1C1E',
    },
    text: {
      primary: colors.lightPrimary,
      secondary: Color(colors.lightPrimary).alpha(0.6).string(),
      tertiary: Color(colors.lightPrimary).alpha(0.33).string(),
      quaternary: Color(colors.lightPrimary).alpha(0.18).string(),
      action: colors.secondary,
      placeholder: Color(colors.lightPrimary).alpha(0.3).string(),

      // deprecated
      link: colors.secondary,
    },
    background: {
      paper: colors.paper || '#1C1C1E',
      screen: colors.screen || colors.black || '#000000',
      system: Color('#636366').alpha(0.36).string(),
      system2: Color('#636366').alpha(0.32).string(),
      system3: Color('#636366').alpha(0.24).string(),
      system4: Color('#636366').alpha(0.18).string(),

      thick: Color(colors.gray6 || colors.neutral?.gray6 || '#1C1C1E')
        .alpha(0.92)
        .string(),
      regular: Color(colors.gray6 || colors.neutral?.gray6 || '#1C1C1E')
        .alpha(0.8)
        .string(),
      thin: Color(colors.gray6 || colors.neutral?.gray6 || '#1C1C1E')
        .alpha(0.65)
        .string(),
      ultrathin: Color(colors.gray6 || colors.neutral?.gray6 || '#1C1C1E')
        .alpha(0.4)
        .string(),
      chrome: Color(colors.gray6 || colors.paper || '#FFFFFF')
        .alpha(0.92)
        .string(),

      // deprecated
      secondary: Color(colors.darkTertiary).fade(alpha.medium).string(),
      accent: Color(colors.darkTertiary).fade(alpha.medium).string(),
      inactive: colors.darkTertiary,
    },
    shadows: {
      default: Color(colors.black).fade(alpha.high).string(),
    },
    action: {
      default: colors.darkTertiary,
      primary: colors.primary,
      secondary: colors.secondary,
      tertiary: colors.tertiary,
    },
  },
  barStyle: 'light-content',
});

export default dark;
