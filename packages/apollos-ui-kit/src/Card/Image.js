import { Platform } from 'react-native';
import { compose } from 'recompose';

import GradientOverlayImage from '../GradientOverlayImage';
import styled from '../styled';
import { getIsLoading } from '../isLoading';

const Image = compose(
  getIsLoading,
  styled(
    ({ theme }) => ({
      width: '100%',
      ...Platform.select({
        android: {
          // fixes android borderRadius overflow display issue
          borderTopRightRadius: theme.sizing.baseBorderRadius,
          borderTopLeftRadius: theme.sizing.baseBorderRadius,
        },
      }),
    }),
    'ui-kit.Card.Image.Image'
  )
)(GradientOverlayImage);

Image.propTypes = GradientOverlayImage.propTypes;

export default Image;
