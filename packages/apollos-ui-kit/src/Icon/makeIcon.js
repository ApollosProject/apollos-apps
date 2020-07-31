import { withTheme } from '../theme';

// Currently used to inject default fill color to icons.
// Eventually can be used for other shared functionality between icons
const makeIcon = withTheme(
  ({ theme, fill, ...otherProps } = {}) => ({
    fill: fill || theme.colors.text.primary,
    ...otherProps,
  }),
  'ui-kit.Icon.makeIcon'
);

export default makeIcon;
