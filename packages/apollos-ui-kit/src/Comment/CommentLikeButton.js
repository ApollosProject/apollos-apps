import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { withTheme } from '../theme';
import styled from '../styled';
import { BodyText } from '../typography';
import Touchable from '../Touchable';
import Icon from '../Icon';

const LikeText = styled({})(BodyText);

const LikeWrapper = styled({
  flexDirection: 'row',
  alignItems: 'center',
})(View);

const LikeIcon = withTheme(({ theme: { sizing, colors } }) => ({
  size: sizing.baseUnit * 1.5,
  marginRight: sizing.baseUnit / 2,
  fill: colors.text.secondary,
}))(Icon);

const ScriptureLikeButton = (props) => (
  <Touchable {...props}>
    <LikeWrapper>
      <LikeIcon name={'thumbs-up'} />
      <LikeText>{'Like'}</LikeText>
    </LikeWrapper>
  </Touchable>
);

ScriptureLikeButton.propTypes = {
  onPress: PropTypes.func,
};

export default ScriptureLikeButton;
