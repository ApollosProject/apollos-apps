import { StyleSheet } from 'react-native';
import { compose } from 'recompose';

import styled from '../styled';
import GradientOverlayImage from '../GradientOverlayImage';
import { getIsLoading } from '../isLoading';

const Image = compose(
  getIsLoading,
  styled(
    {
      ...StyleSheet.absoluteFillObject,
      height: '100%',
      paddingTop: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    'Card.Image'
  )
)(GradientOverlayImage);

Image.propTypes = GradientOverlayImage.propTypes;

export default Image;
