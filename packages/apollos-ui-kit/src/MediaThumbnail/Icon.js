import { withTheme } from '../theme';
import Icon from '../Icon';

const MediaThumbnailIcon = withTheme(({ theme }) => ({
  size: theme.sizing.baseUnit,
}))(Icon);

export default MediaThumbnailIcon;
