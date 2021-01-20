import React, { useState } from 'react';
import { StyleSheet, TextInput, KeyboardAvoidingView } from 'react-native';
import PropTypes from 'prop-types';
import styled from '../styled';
import { H4, H5, BodySmall } from '../typography';
import Touchable from '../Touchable';
import Avatar from '../Avatar';
import { withTheme } from '../theme';
import PaddedView from '../PaddedView';

const CommentAvatar = withTheme(({ theme: { sizing, colors } }) => ({
  themeSize: sizing.baseUnit * 3,
  buttonIcon: 'chunky-plus',
  iconButtonProps: {
    size: sizing.baseUnit * 0.75,
    fill: colors.white,
    iconBackground: colors.action.secondary,
  },
}))(Avatar);

const AddCommentContainer = styled(({ theme: { sizing } }) => ({
  borderBottomWidth: StyleSheet.hairlineWidth,
  borderTopWidth: StyleSheet.hairlineWidth,
  borderColor: 'rgba(0, 0, 0, 0.1)',
  padding: sizing.baseUnit,
  flexDirection: 'row',
  alignItems: 'center',
}))(Touchable);

const NextButton = styled(({ theme: { colors } }) => ({
  color: colors.action.secondary,
}))(H4);

const NextButtonTouchable = styled({ alignSelf: 'flex-end' })(Touchable);

const AddCommentPrompt = styled(({ theme: { sizing } }) => ({
  padding: sizing.baseUnit / 2,
}))(H5);

const AddCommentTextInput = styled(({ theme: { sizing } }) => ({
  minHeight: sizing.baseUnit * 4,
}))(TextInput);

const AddCommentInput = ({ initialPrompt, addPrompt, onSubmit }) => {
  const [isWriting, setIsWriting] = useState(false);
  const [currentText, setCurrentText] = useState(null);
  return isWriting ? (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={40}>
      <PaddedView>
        <BodySmall>{addPrompt}</BodySmall>
        <AddCommentTextInput
          multiline
          onChangeText={(text) => setCurrentText(text)}
        />
        <NextButtonTouchable
          onPress={() => onSubmit(currentText) && setIsWriting(false)}
        >
          <NextButton>{'Submit'}</NextButton>
        </NextButtonTouchable>
      </PaddedView>
    </KeyboardAvoidingView>
  ) : (
    <AddCommentContainer onPress={() => setIsWriting(true)}>
      <CommentAvatar />
      <AddCommentPrompt>{currentText || initialPrompt}</AddCommentPrompt>
    </AddCommentContainer>
  );
};

AddCommentInput.propTypes = {
  initialPrompt: PropTypes.string,
  addPrompt: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
};

AddCommentInput.defaultProps = {
  initialPrompt: 'Write Something...',
  addPrompt: 'What stands out to you?',
};

export default AddCommentInput;
