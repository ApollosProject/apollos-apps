import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { withTheme, named } from '../theme';
import styled from '../styled';
import { BodyText } from '../typography';
import Touchable from '../Touchable';
import Icon from '../Icon';

const LikeText = named('ui-kit.CommentLikeButton.LikeText')(BodyText);

const LikeWrapper = styled(
  {
    flexDirection: 'row',
    alignItems: 'center',
  },
  'ui-kit.CommentLikeButton.LikeWrapper'
)(View);

const LikeIcon = withTheme(
  ({ theme: { sizing, colors } }) => ({
    size: sizing.baseUnit * 1.5,
    marginRight: sizing.baseUnit / 2,
    fill: colors.text.secondary,
  }),
  'ui-kit.CommentLikeButton.LikeIcon'
)(Icon);

const ScriptureLikeButton = (props) => (
  <Touchable {...props}>
    <LikeWrapper>
      <LikeIcon name={props.isLiked ? 'like-solid' : 'like'} />
      <LikeText>{props.isLiked ? 'Liked' : 'Like'}</LikeText>
    </LikeWrapper>
  </Touchable>
);

ScriptureLikeButton.propTypes = {
  onPress: PropTypes.func,
  isLiked: PropTypes.bool,
};

export default ScriptureLikeButton;
