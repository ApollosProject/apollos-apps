import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import { useSafeAreaInsets, FlexedSafeAreaView } from '../LayoutContext';
import styled from '../styled';
import { H4, H5 } from '../typography';
import Touchable from '../Touchable';
import Avatar from '../Avatar';
import { withTheme } from '../theme';
import PaddedView from '../PaddedView';
import Modal, { ModalHeader } from '../Modal';
import { Switch, Text as TextInput } from '../inputs';

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

const EditorAvatar = withTheme(
  ({ theme: { sizing, colors } }) => ({
    themeSize: sizing.baseUnit * 3,
    buttonIcon: 'chunky-plus',
    iconButtonProps: {
      size: sizing.baseUnit * 0.75,
      fill: colors.white,
      iconBackground: colors.action.secondary,
    },
    containerStyle: {
      marginRight: sizing.baseUnit / 2,
    },
  }),
  'ui-kit.AddCommentInput.EditorAvatar'
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

const ModalBackgroundView = styled(({ theme }) => ({
  borderTopLeftRadius: theme.sizing.baseUnit,
  borderTopRightRadius: theme.sizing.baseUnit,
  backgroundColor: theme.colors.background.paper,
  ...Platform.select({ ios: theme.shadows.default.ios }),
}))(View);

const NextButton = styled(
  ({ theme: { colors } }) => ({
    color: colors.action.secondary,
  }),
  'ui-kit.AddCommentInput.NextButton'
)(H4);

const EditorButtons = styled(
  ({ theme }) => ({
    paddingBottom: theme.sizing.baseUnit,
    alignSelf: 'flex-end',
  }),
  'ui-kit.AddCommentInput.EditorButtons'
)(View);

const AddCommentPrompt = styled(
  ({ theme: { sizing } }) => ({
    padding: sizing.baseUnit / 2,
  }),
  'ui-kit.AddCommentInput.AddCommentPrompt'
)(H5);

const CommentInputContainer = styled(
  ({ theme }) => ({
    flex: 1,
    paddingHorizontal: theme.sizing.baseUnit,
  }),
  'ui-kit.AddCommentInput.CommentInputContainer'
)(Platform.OS === 'android' ? View : KeyboardAvoidingView);

const UserData = styled(
  () => ({
    flexDirection: 'row',
    alignItems: 'center',
  }),
  'ui-kit.AddCommentInput.UserData'
)(PaddedView);

const UserName = styled(
  ({ theme }) => ({
    marginLeft: theme.sizing.baseUnit / 2,
  }),
  'ui-kit.AddCommentInput.UserName'
)(H4);

const ModalAvatar = withTheme(
  ({ theme: { sizing } }) => ({
    themeSize: sizing.baseUnit * 3,
  }),
  'ui-kit.AddCommentInput.CommentAvatar'
)(Avatar);

const ModalContent = styled(
  () => ({}),
  'ui-kit.AddCommentInput.ModalContent'
)(View);

const Share = styled(
  ({ theme }) => ({
    marginVertical: theme.sizing.baseUnit,
    paddingVertical: theme.sizing.baseUnit,
    paddingHorizontal: theme.sizing.baseUnit,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.lightSecondary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
  'ui-kit.AddCommentInput.Share'
)(View);

const CurrentText = styled(
  ({ theme }) => ({
    color: theme.colors.text.primary,
    fontSize: theme.typography.baseFontSize,
    lineHeight: theme.typography.baseLineHeight,
    paddingHorizontal: theme.sizing.baseUnit,
  }),
  'ui-kit.AddCommentInput.CurrentText'
)(Text);

const ShareText = styled(
  () => ({
    flexShrink: 1,
  }),
  'ui-kit.AddCommentInput.ShareText'
)(View);

const ShareDisclaimer = styled(
  ({ theme }) => ({
    color: theme.colors.text.tertiary,
  }),
  'ui-kit.AddCommentInput.ShareDisclaimer'
)(H5);

const StyledTextInput = withTheme(({ theme }) => ({
  wrapperStyle: {
    marginVertical: 0,
    paddingTop: theme.sizing.baseUnit / 2,
    flex: 1,
  },
  inputAddonStyle: {
    justifyContent: 'flex-start',
  },
  style: {
    height: null,
    marginTop: theme.sizing.baseUnit / 2,
    marginBottom: theme.sizing.baseUnit / 2,
  },
  floatingLabelStyle: {
    height: 30, // magic value from Text Input component
  },
}))(TextInput);

const FlexedMaxHeightSafeAreaView = styled({
  minHeight: '100%',
})(FlexedSafeAreaView);

const AddCommentInput = ({
  prompt = 'What stands out to you?',
  openBottomSheetOnMount = true,
  dismissEditorOnPanDown = false,
  onSubmit,
  profile,
}) => {
  const [currentText, setCurrentText] = useState('');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [share, setShare] = useState('PRIVATE');
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

  // ref
  const bottomSheetModalRef = useRef(null);
  const editorRef = useRef(null);

  // variables
  const insets = useSafeAreaInsets();
  const handleHeight = 24; // todo: static from react-native-bottom-sheet
  const initialSnapPoint = Platform.select({ ios: 54, android: 64 });
  const snapPoints = useMemo(() => [initialSnapPoint + insets.bottom, '100%'], [
    insets.bottom,
  ]);

  // present on mount
  // todo: make this optional via a prop
  useEffect(() => {
    if (openBottomSheetOnMount) {
      bottomSheetModalRef.current?.present();
      setBottomSheetOpen(true);
    }
  }, [openBottomSheetOnMount]);

  const handleStartWriting = useCallback(() => {
    bottomSheetModalRef.current?.expand();
    setBottomSheetOpen(true);
  }, []);

  const handleStopWriting = useCallback(() => {
    bottomSheetModalRef.current?.collapse();
  }, []);

  const onPressSave = async () => {
    onSubmit && (await onSubmit(currentText, share)); // eslint-disable-line no-unused-expressions
    bottomSheetModalRef.current?.close();
    setConfirmModalOpen(false);
    setBottomSheetOpen(false);
  };

  const handleEditorChange = useCallback((index) => {
    if (!index) {
      Keyboard.dismiss();
    } else {
      editorRef.current?.focus();
    }
  }, []);

  const openModal = useCallback(() => {
    bottomSheetModalRef.current?.expand();
    setBottomSheetOpen(true);
  }, []);

  return (
    <>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleEditorChange}
        dismissOnPanDown={dismissEditorOnPanDown}
        animateOnMount
        topInset={insets.top}
        bottomInset={insets.bottom}
        handleHeight={handleHeight}
        enableContentPanningGesture
        enableHandlePanningGesture
        // todo: re-enable when working keyboardBehavior={'interactive'}

        // this functional component below fixes dark mode compat...think it
        // has something to do with the component not re-rendering properly
        backgroundComponent={(props) => <ModalBackgroundView {...props} />} // eslint-disable-line react/jsx-props-no-spreading
      >
        <FlexedMaxHeightSafeAreaView edges={['right', 'bottom', 'left']}>
          <CommentInputContainer
            keyboardVerticalOffset={handleHeight + insets.top}
            behavior="padding"
          >
            <StyledTextInput
              prefix={<EditorAvatar source={profile?.image} />}
              label={prompt}
              inputRef={editorRef}
              multiline
              onChangeText={(text) => setCurrentText(text)}
              onFocus={handleStartWriting}
              onBlur={handleStopWriting}
              enablesReturnKeyAutomatically
              underline={false}
            />
            <EditorButtons>
              <NextButton onPress={() => setConfirmModalOpen(true)}>
                {'Submit'}
              </NextButton>
            </EditorButtons>
          </CommentInputContainer>
        </FlexedMaxHeightSafeAreaView>
      </BottomSheetModal>

      {!bottomSheetOpen ? (
        <Touchable onPress={openModal}>
          <AddCommentContainer>
            <CommentAvatar source={profile?.image} />
            <AddCommentPrompt>{prompt}</AddCommentPrompt>
          </AddCommentContainer>
        </Touchable>
      ) : null}

      <Modal
        visible={confirmModalOpen}
        animationType="slide"
        onRequestClose={() => setConfirmModalOpen(false)}
      >
        <ModalHeader
          onNext={onPressSave}
          onNextText="Save"
          onPrevious={() => setConfirmModalOpen(false)}
          onPreviousText="Cancel"
          title="New Journal"
        />
        <ModalContent>
          <UserData>
            <ModalAvatar source={profile?.image} />
            <UserName numberOfLines={1}>{profile?.nickName}</UserName>
          </UserData>
          <CurrentText>{currentText}</CurrentText>
          <Share>
            <ShareText>
              <H4>Share with the Community</H4>
              <ShareDisclaimer>
                Your name and photo will be visible to the community.
              </ShareDisclaimer>
            </ShareText>
            <Switch
              value={share === 'PUBLIC'}
              onValueChange={(value) => setShare(value ? 'PUBLIC' : 'PRIVATE')}
            />
          </Share>
        </ModalContent>
      </Modal>
    </>
  );
};

AddCommentInput.propTypes = {
  prompt: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    image: PropTypes.shape({ uri: PropTypes.string }),
    nickName: PropTypes.string,
  }),
  openBottomSheetOnMount: PropTypes.bool,
  dismissEditorOnPanDown: PropTypes.bool,
};

export default AddCommentInput;
