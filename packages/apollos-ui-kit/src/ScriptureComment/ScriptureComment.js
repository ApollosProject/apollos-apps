import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Avatar from '../Avatar';
import { withTheme } from '../theme';
import styled from '../styled';
import { H4, BodyText, H6 } from '../typography';
import CommentLikeButton from './CommentLikeButton';
import ActionMenu from './ActionMenu';

const HeaderContainer = styled(
  {
    flexDirection: 'row',
    alignItems: 'center',
  },
  'ui-kit.ScriptureComment.HeaderContainer'
)(View);

const CommentAvatar = withTheme(
  ({ theme: { sizing } }) => ({
    themeSize: sizing.baseUnit * 3,
  }),
  'ui-kit.ScriptureComment.CommentAvatar'
)(Avatar);

const HeaderTextContainer = styled(
  ({ theme: { sizing } }) => ({
    marginLeft: sizing.baseUnit / 2,
    justifyContent: 'center',
  }),
  'ui-kit.ScriptureComment.HeaderTextContainer'
)(View);

const Subtitle = styled(
  ({
    theme: {
      colors: {
        text: { tertiary },
      },
    },
  }) => ({
    color: tertiary,
  }),
  'ui-kit.ScriptureComment.Subtitle'
)(H6);

const ScriptureCommentContainer = styled(
  ({ theme: { sizing } }) => ({
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    padding: sizing.baseUnit,
  }),
  'ui-kit.ScriptureComment.ScriptureCommentContainer'
)(View);

const CommentText = styled(
  ({ theme: { sizing } }) => ({
    marginVertical: sizing.baseUnit / 2,
  }),
  'ui-kit.ScriptureComment.CommentText'
)(BodyText);

const ScriptureComment = ({
  profile,
  commentText,
  subtitle,
  onPressLike,
  onPressActionMenu,
}) => {
  return (
    <ScriptureCommentContainer>
      <HeaderContainer>
        <CommentAvatar source={profile.image} />
        <HeaderTextContainer>
          <H4>{profile.nickName}</H4>
          <Subtitle>{subtitle}</Subtitle>
        </HeaderTextContainer>
        {onPressActionMenu && <ActionMenu onPress={onPressActionMenu} />}
      </HeaderContainer>
      <CommentText>{commentText}</CommentText>
      {onPressLike && <CommentLikeButton onPress={onPressLike} />}
    </ScriptureCommentContainer>
  );
};

ScriptureComment.propTypes = {
  profile: PropTypes.shape({
    image: PropTypes.shape({ uri: PropTypes.string }),
    nickName: PropTypes.string,
  }),
  subtitle: PropTypes.string,
  commentText: PropTypes.string,
  onPressActionMenu: PropTypes.func,
  onPressLike: PropTypes.func,
};

export default ScriptureComment;
