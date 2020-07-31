import { withTheme } from '../theme';
import Icon from '../Icon';

const MediaThumbnailIcon = withTheme(
  ({ theme }) => ({
    size: theme.sizing.baseUnit,
  }),
  'ui-kit.MediaThumbnail.Icon.MediaThumbnailIcon'
)(Icon);

export default MediaThumbnailIcon;
