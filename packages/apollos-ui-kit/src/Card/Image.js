import { Platform } from 'react-native';
import { compose, withProps } from 'recompose';

import ConnectedImage from '../ConnectedImage';
import styled from '../styled';
import { getIsLoading } from '../isLoading';

const Image = compose(
  getIsLoading,
  withProps({ maintainAspectRatio: true }),
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
)(ConnectedImage);

Image.propTypes = ConnectedImage.propTypes;

export default Image;
