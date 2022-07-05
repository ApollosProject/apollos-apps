export const named = () => (Component) => (props) => <Component {...props} />;
export const styled = (style) => (Component) => (props) =>
  <Component {...props} style={style} />;
export const withTheme = (newProps) => (Component) => (props) =>
  <Component {...props} {...newProps} />;
export const withIsLoading = (Component) => (props) =>
  <Component isLoading={false} {...props} />;
export const useTheme = () => ({
  colors: { background: {} },
  sizing: {},
});
export const NavigationService = { resetToAuth: () => null };
export const H1 = 'H1';
export const H2 = 'H2';
export const H3 = 'H3';
export const H4 = 'H4';
export const H5 = 'H5';
export const H6 = 'H6';
export const UIText = 'UIText';
export const Avatar = 'Avatar';
export const AvatarCloud = 'AvatarCloud';
export const Icon = 'Icon';
export const ButtonLink = 'ButtonLink';
export const PaddedView = 'PaddedView';
export const BackgroundView = 'BackgroundView';
export const TableView = 'TableView';
export const Row = 'Row';
export const Divider = 'Divider';
export const Touchable = 'Touchable';
export const TextInput = 'TextInput';
export const Button = 'Button';
export const CampusCard = 'CampusCard';
export const Card = 'Card';
export const CardContent = 'CardContent';
export const ByLine = 'ByLine';
export const AppIcon = 'AppIcon';
export const SocialBar = 'SocialBar';
export const GradientOverlayImage = 'GradientOverlayImage';
export const RadioButton = 'RadioButton';
export const Radio = 'Radio';
export const DateInput = 'DateInput';
