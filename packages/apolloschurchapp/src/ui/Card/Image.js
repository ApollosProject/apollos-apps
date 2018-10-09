import { Platform } from 'react-native';
import { compose } from 'recompose';

import styled from 'apolloschurchapp/src/ui/styled';
import GradientOverlayImage from 'apolloschurchapp/src/ui/GradientOverlayImage';
import { getIsLoading } from 'apolloschurchapp/src/ui/isLoading';

const Image = compose(
  getIsLoading,
  styled(
    ({ theme }) => ({
      width: '100%',
      ...Platform.select({
        android: {
          // fixes android borderRadius overflow display issue
          borderTopRightRadius: theme.sizing.borderRadius,
          borderTopLeftRadius: theme.sizing.borderRadius,
        },
      }),
    }),
    'Card.Image'
  )
)(GradientOverlayImage);

Image.propTypes = GradientOverlayImage.propTypes;

export default Image;
