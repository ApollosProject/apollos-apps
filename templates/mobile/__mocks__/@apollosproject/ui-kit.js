export const named = () => (Component) => (props) => <Component {...props} />;
export const styled = (style) => (Component) => (props) =>
  <Component {...props} style={style} />;
export const withTheme = (newProps) => (Component) => (props) =>
  <Component {...props} {...newProps} />;
export const H3 = 'H3';
export const H5 = 'H5';
export const H6 = 'H6';
export const PaddedView = 'PaddedView';
export const BackgroundView = 'BackgroundView';
export const TableView = 'TableView';
export const Row = 'Row';
export const Divider = 'Divider';
export const Touchable = 'Touchable';
export const TextInput = 'TextInput';
export const Button = 'Button';
export const NavigationService = { resetToAuth: () => null };
