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
  'ui-kit.Comment.HeaderContainer'
)(View);

const CommentAvatar = withTheme(
  ({ theme: { sizing } }) => ({
    themeSize: sizing.baseUnit * 3,
  }),
  'ui-kit.Comment.CommentAvatar'
)(Avatar);

const HeaderTextContainer = styled(
  ({ theme: { sizing } }) => ({
    marginLeft: sizing.baseUnit / 2,
    justifyContent: 'center',
  }),
  'ui-kit.Comment.HeaderTextContainer'
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
  'ui-kit.Comment.Subtitle'
)(H6);

const CommentContainer = styled(
  ({ theme: { sizing } }) => ({
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    padding: sizing.baseUnit,
  }),
  'ui-kit.Comment.CommentContainer'
)(View);

const CommentText = styled(
  ({ theme: { sizing } }) => ({
    marginVertical: sizing.baseUnit / 2,
  }),
  'ui-kit.Comment.CommentText'
)(BodyText);

const Comment = ({
  profile,
  commentText,
  isLiked,
  subtitle,
  onPressLike,
  onPressActionMenu,
}) => {
  return (
    <CommentContainer>
      <HeaderContainer>
        <CommentAvatar profile={profile} />
        <HeaderTextContainer>
          <H4>{profile.nickName}</H4>
          <Subtitle>{subtitle}</Subtitle>
        </HeaderTextContainer>
        {onPressActionMenu && <ActionMenu onPress={onPressActionMenu} />}
      </HeaderContainer>
      <CommentText>{commentText}</CommentText>
      {onPressLike && (
        <CommentLikeButton isLiked={isLiked} onPress={onPressLike} />
      )}
    </CommentContainer>
  );
};

Comment.propTypes = {
  profile: PropTypes.shape({
    photo: PropTypes.shape({ uri: PropTypes.string }),
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    nickName: PropTypes.string,
  }),
  subtitle: PropTypes.string,
  commentText: PropTypes.string,
  onPressActionMenu: PropTypes.func,
  onPressLike: PropTypes.func,
  isLiked: PropTypes.bool,
};

export default Comment;
