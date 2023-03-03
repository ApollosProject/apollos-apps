import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import Avatar from '../Avatar';
import { H5 } from '../typography';
import { withTheme } from '../theme';
import styled from '../styled';

const CommentAvatar = withTheme(
  ({ theme: { sizing, colors } }) => ({
    themeSize: sizing.baseUnit * 3,
    buttonIcon: 'chunky-plus',
    iconButtonProps: {
      size: sizing.baseUnit * 0.75,
      fill: colors.white,
      iconBackground: colors.action.secondary,
    },
  }),
  'ui-kit.AddCommentInput.CommentAvatar'
)(Avatar);

const AddCommentContainer = styled(
  ({ theme: { sizing } }) => ({
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    padding: sizing.baseUnit,
    flexDirection: 'row',
    alignItems: 'center',
  }),
  'ui-kit.AddCommentInput.AddCommentContainer'
)(View);

const AddCommentPrompt = styled(
  ({ theme: { sizing } }) => ({
    padding: sizing.baseUnit / 2,
  }),
  'ui-kit.AddCommentInput.AddCommentPrompt'
)(H5);

const Prompt = ({ prompt, profile }) => (
  <AddCommentContainer>
    <CommentAvatar profile={profile} />
    <AddCommentPrompt>{prompt}</AddCommentPrompt>
  </AddCommentContainer>
);

Prompt.propTypes = {
  prompt: PropTypes.string,
  profile: PropTypes.shape({
    image: PropTypes.shape({ uri: PropTypes.string }),
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }),
};

export default Prompt;
