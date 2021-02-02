import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '../theme';
import styled from '../styled';
import { BodyText } from '../typography';
import Touchable from '../Touchable';
import Icon from '../Icon';

const LikeText = styled({})(BodyText);

const LikeTouchable = styled({
  flexDirection: 'row',
  alignItems: 'center',
})(Touchable);

const LikeIcon = withTheme(({ theme: { sizing, colors } }) => ({
  size: sizing.baseUnit * 1.5,
  marginRight: sizing.baseUnit / 2,
  fill: colors.text.secondary,
}))(Icon);

const ScriptureLikeButton = (props) => (
  <LikeTouchable {...props}>
    <LikeIcon name={'thumbs-up'} />
    <LikeText>{'Like'}</LikeText>
  </LikeTouchable>
);

ScriptureLikeButton.propTypes = {
  onPress: PropTypes.func,
};

export default ScriptureLikeButton;
