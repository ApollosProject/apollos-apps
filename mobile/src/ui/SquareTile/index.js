import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PropTypes from 'prop-types';
import { pure, compose } from 'recompose';

import { H6 } from 'ui/typography';
import styled from 'ui/styled';
import SquareTileImage from './SquareTileImage';

const CardView = styled(
  ({ theme }) => ({
    borderRadius: theme.sizing.borderRadius,
    overflow: 'hidden',
  }),
  'SquareTile'
)(View);

const SquareTileText = styled(
  ({ theme }) => ({
    position: 'absolute',
    bottom: theme.sizing.baseUnit,
    left: theme.sizing.baseUnit,
    backgroundColor: 'transparent',
    color: theme.colors.lightPrimary,
  }),
  'SquareTile.Text'
)(H6);

const enhance = compose(pure);

const SquareTile = enhance(({ image, link, onPressItem, text }) => (
  <TouchableWithoutFeedback onPress={() => onPressItem({ ...link })}>
    <CardView>
      <SquareTileImage source={image} />
      {text ? (
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']}
          locations={[0.3, 1]}
          style={StyleSheet.absoluteFill}
        >
          <SquareTileText>{text}</SquareTileText>
        </LinearGradient>
      ) : null}
    </CardView>
  </TouchableWithoutFeedback>
));

SquareTile.propTypes = {
  image: SquareTileImage.propTypes.source,
  link: PropTypes.string.isRequired,
  onPressItem: PropTypes.func,
  text: PropTypes.string,
};

export default SquareTile;
