import LinearGradient from 'react-native-linear-gradient';
import { compose } from 'recompose';

import styled from '../styled';
import { withTheme } from '../theme';

const BackgroundView = compose(
  withTheme(({ theme, colors, ...props }) => ({
    colors: colors ||
      theme.overrides.backgroundGradient || [
        theme.colors.background.paper,
        theme.colors.background.screen,
      ],
    ...props,
  })),
  styled({ flex: 1 })
)(LinearGradient);

export default BackgroundView;
