import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import PropTypes from 'prop-types';
import styled from '../styled';
import { H4, H5, BodySmall } from '../typography';
import Touchable from '../Touchable';
import Avatar from '../Avatar';
import { withTheme } from '../theme';
import PaddedView from '../PaddedView';

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

const NextButton = styled(
  ({ theme: { colors } }) => ({
    color: colors.action.secondary,
  }),
  'ui-kit.AddCommentInput.NextButton'
)(H4);

const NextButtonTouchable = styled(
  { alignSelf: 'flex-end' },
  'ui-kit.AddCommentInput.NextButtonTouchable'
)(Touchable);

const AddCommentPrompt = styled(
  ({ theme: { sizing } }) => ({
    padding: sizing.baseUnit / 2,
  }),
  'ui-kit.AddCommentInput.AddCommentPrompt'
)(H5);

const AddCommentTextInput = styled(
  ({ theme: { sizing, colors } }) => ({
    minHeight: sizing.baseUnit * 4,
    color: colors.text.primary,
  }),
  'ui-kit.AddCommentInput.AddCommentTextInput'
)(TextInput);

const CommentInputContainer = styled(
  {},
  'ui-kit.AddCommentInput.CommentInputContainer'
)(PaddedView);

const AddCommentInput = ({ initialPrompt, addPrompt, onSubmit, profile }) => {
  const [isWriting, setIsWriting] = useState(false);
  const [currentText, setCurrentText] = useState(null);

  const onPressSubmit = async () => {
    onSubmit && (await onSubmit(currentText)); // eslint-disable-line no-unused-expressions
    setIsWriting(false);
  };

  const onStartWriting = () => {
    setCurrentText(null);
    setIsWriting(true);
  };

  return isWriting ? (
    <CommentInputContainer>
      <BodySmall>{addPrompt}</BodySmall>
      <AddCommentTextInput
        multiline
        autoFocus
        onChangeText={(text) => setCurrentText(text)}
      />
      <NextButtonTouchable onPress={onPressSubmit}>
        <NextButton>{'Submit'}</NextButton>
      </NextButtonTouchable>
    </CommentInputContainer>
  ) : (
    <Touchable onPress={onStartWriting}>
      <AddCommentContainer>
        <CommentAvatar source={profile?.image} />
        <AddCommentPrompt>{currentText || initialPrompt}</AddCommentPrompt>
      </AddCommentContainer>
    </Touchable>
  );
};

AddCommentInput.propTypes = {
  initialPrompt: PropTypes.string,
  addPrompt: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    image: PropTypes.shape({ uri: PropTypes.string }),
  }),
};

AddCommentInput.defaultProps = {
  initialPrompt: 'Write Something...',
  addPrompt: 'What stands out to you?',
};

export default AddCommentInput;
