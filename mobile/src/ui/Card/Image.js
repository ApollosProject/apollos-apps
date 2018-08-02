import { Platform } from 'react-native';
import { compose } from 'recompose';

import styled from '/mobile/ui/styled';
import ProgressiveImage from '/mobile/ui/ProgressiveImage';
import { getIsLoading } from '/mobile/ui/isLoading';

const Image = compose(
  getIsLoading,
  styled(
    ({ theme }) => ({
      aspectRatio: 1,
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
)(ProgressiveImage);

Image.propTypes = ProgressiveImage.propTypes;

export default Image;
