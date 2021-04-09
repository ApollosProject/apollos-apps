import React, {
  useRef,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { Platform, View, Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Touchable from '../Touchable';
import styled from '../styled';
import Navigator from './Navigator';
import Prompt from './Prompt';

const ModalBackgroundView = styled(({ theme }) => ({
  borderTopLeftRadius: theme.sizing.baseUnit,
  borderTopRightRadius: theme.sizing.baseUnit,
  backgroundColor: theme.colors.background.paper,
  ...Platform.select({ ios: theme.shadows.default.ios }),
}))(View);

const AddCommentInput = ({
  prompt = 'What stands out to you?',
  editorTitle = 'New Journal',
  confirmationTitle = 'Post Journal',
  initialValue = '',
  openBottomSheetOnMount = true,
  showInlinePrompt = true,
  dismissOnPanDown = false,
  fullscreen = false,
  showCancel = false,
  // Used so that parent components can also get access to the bottom sheet modal ref.
  bottomSheetModalRef: setBottomSheetModalRef,
  onSubmit,
  profile,
  ...props
}) => {
  const safeArea = useSafeAreaInsets();
  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1);

  const fullScreenSnapPoints = useMemo(() => ['100%'], [safeArea.bottom]);
  // todo: when we have useTheme() replace this
  const snapPoints = useMemo(
    () => [48 + 16 + (safeArea.bottom || 16), '100%'],
    [safeArea.bottom]
  );
  const bottomSheetModalRef = useRef();

  const handleEditorChange = useCallback(
    (index) => {
      setBottomSheetIndex(index);
      if (!index) {
        Keyboard.dismiss();
      }
    },
    [setBottomSheetIndex]
  );

  const openModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  // present on mount
  useEffect(() => {
    if (openBottomSheetOnMount) {
      bottomSheetModalRef.current?.present();
    }
  }, [openBottomSheetOnMount]);

  useEffect(() => {
    if (bottomSheetModalRef && setBottomSheetModalRef) {
      // eslint-disable-next-line no-param-reassign
      setBottomSheetModalRef.current = bottomSheetModalRef.current;
    }
  }, [setBottomSheetModalRef, bottomSheetModalRef]);

  return (
    <>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={fullscreen ? fullScreenSnapPoints : snapPoints}
        onChange={handleEditorChange}
        topInset={safeArea.top}
        animateOnMount
        // keyboardBehavior={'fullScreen'}
        dismissOnPanDown={dismissOnPanDown}
        backgroundComponent={(bgProps) => <ModalBackgroundView {...bgProps} />} // eslint-disable-line react/jsx-props-no-spreading
        {...props}
      >
        <Navigator
          onSubmit={onSubmit}
          profile={profile}
          prompt={prompt}
          initialValue={initialValue}
          bottomSheetModalRef={bottomSheetModalRef}
          bottomSheetIndex={bottomSheetIndex}
          editorTitle={editorTitle}
          confirmationTitle={confirmationTitle}
          showCancel={showCancel}
        />
      </BottomSheetModal>

      {showInlinePrompt ? (
        <Touchable onPress={openModal}>
          <Prompt image={profile?.photo} prompt={prompt} />
        </Touchable>
      ) : null}
    </>
  );
};

AddCommentInput.propTypes = {
  prompt: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    photo: PropTypes.shape({ uri: PropTypes.string }),
    nickName: PropTypes.string,
  }),
  bottomSheetModalRef: PropTypes.shape({
    current: PropTypes.shape({
      present: PropTypes.func,
    }),
  }),
  openBottomSheetOnMount: PropTypes.bool,
  showInlinePrompt: PropTypes.bool,
  dismissOnPanDown: PropTypes.bool,
  fullscreen: PropTypes.bool,
  showCancel: PropTypes.bool,
  editorTitle: PropTypes.string,
  confirmationTitle: PropTypes.string,
  initialValue: PropTypes.string,
};

export default AddCommentInput;
