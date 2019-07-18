import LinearGradient from 'react-native-linear-gradient';
import { compose } from 'recompose';

import styled from '../styled';
import { withTheme } from '../theme';

const BackgroundView = compose(
  // Accepts all props available to View and LinearGradient.
  // https://github.com/react-native-community/react-native-linear-gradient#additional-props
  withTheme(({ theme: { overlays }, colors, ...props }) => ({
    ...overlays['background-gradient']({ colors }),
    ...props,
  })),
  styled({ flex: 1, height: '100%' })
)(LinearGradient);

export default BackgroundView;
