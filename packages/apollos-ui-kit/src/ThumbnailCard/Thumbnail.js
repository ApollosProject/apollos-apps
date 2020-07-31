import { StyleSheet } from 'react-native';
import { compose } from 'recompose';

import styled from '../styled';
import ConnectedImage from '../ConnectedImage';
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
)(ConnectedImage);

Image.propTypes = ConnectedImage.propTypes;

export default Image;
