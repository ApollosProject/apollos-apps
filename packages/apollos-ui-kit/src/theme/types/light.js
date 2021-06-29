import Color from 'color';

const light = ({ colors, alpha }) => ({
  colors: {
    // Screen and paper on the root theme are deprecated
    // These exist only for backwards compatibility.
    paper: colors.paper || '#FFFFFF',
    screen:
      colors.screen || Color('#F2F2F7').mix(Color('#FFFFFF'), 0.5).string(),

    neutral: {
      gray: colors.gray,
      // TODO: these colors should really be "generated" off of colors.gray
      gray2: '#AFAFB3',
      gray3: '#C7C7CC',
      gray4: '#D1D1D6',
      gray5: '#E5E5EA',
      gray6: '#F2F2F7',
    },
    text: {
      primary: colors.darkPrimary,
      secondary: Color(colors.darkPrimary).alpha(0.6).string(),
      tertiary: Color(colors.darkPrimary).alpha(0.3).string(),
      quaternary: Color(colors.darkPrimary).alpha(0.18).string(),
      action: colors.secondary,
      placeholder: Color('#E5E5EA').alpha(0.3).string(),

      // deprecated
      link: colors.secondary,
    },
    background: {
      paper: colors.paper || '#FFFFFF',
      screen:
        colors.screen || Color('#F2F2F7').mix(Color('#FFFFFF'), 0.5).string(),
      system: Color(colors.gray).alpha(0.2).string(),
      system2: Color(colors.gray).alpha(0.16).string(),
      system3: Color(colors.gray).alpha(0.12).string(),
      system4: Color(colors.gray).alpha(0.08).string(),

      // deprecated
      secondary: colors.paper || '#FFFFFF',
      accent: Color(colors.lightTertiary).fade(alpha.medium).string(),
      inactive: colors.lightTertiary,
    },
    shadows: {
      // deprecated
      default: Color(colors.black).fade(alpha.high).string(),
    },
    // deprecated
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
