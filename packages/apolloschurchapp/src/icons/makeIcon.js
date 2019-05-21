import { withTheme } from '@apollosproject/ui-kit';

// Currently used to inject default fill color to icons.
// Eventually can be used for other shared functionality between icons
const makeIcon = withTheme(({ theme, fill, ...otherProps } = {}) => ({
  fill: fill || 'salmon',
  ...otherProps,
}));

export default makeIcon;
