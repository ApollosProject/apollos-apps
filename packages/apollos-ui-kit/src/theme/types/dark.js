import Color from 'color';

const dark = ({ colors, alpha }) => ({
  colors: {
    // Screen and paper on the root theme are deprecated
    // These exist only for backwards compatibility.
    paper: colors.paper || '#FFFFFF',
    screen:
      colors.screen || Color('#F2F2F7').mix(Color('#FFFFFF'), 0.5).string(),

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
      paper: colors.paper || '#FFFFFF',
      screen:
        colors.screen || Color('#F2F2F7').mix(Color('#FFFFFF'), 0.5).string(),
      system: Color('#636366').alpha(0.36).string(),
      system2: Color('#636366').alpha(0.32).string(),
      system3: Color('#636366').alpha(0.24).string(),
      system4: Color('#636366').alpha(0.18).string(),

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
