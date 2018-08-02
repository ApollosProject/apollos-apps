import LinearGradient from 'react-native-linear-gradient';
import { compose } from 'recompose';

import styled from 'ui/styled';
import { withTheme } from 'ui/theme';

const BackgroundView = compose(
  withTheme(({ theme }) => ({
    colors: [theme.colors.paper, theme.colors.screen],
  })),
  styled({ flex: 1 })
)(LinearGradient);

export default BackgroundView;
