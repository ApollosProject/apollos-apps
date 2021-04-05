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
  expanded = false,
  fullscreen = false,
  showCancel = false,
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
    console.warn('open modal')
    bottomSheetModalRef.current?.present();
  }, []);

  // present on mount
  useEffect(() => {
    if (openBottomSheetOnMount) {
      console.warn('present on mount');
      bottomSheetModalRef.current?.present();
    }
  }, [openBottomSheetOnMount]);

  useEffect(() => {
    if (bottomSheetModalRef && setBottomSheetModalRef) {
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
        backgroundComponent={(props) => <ModalBackgroundView {...props} />} // eslint-disable-line react/jsx-props-no-spreading
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
  openBottomSheetOnMount: PropTypes.bool,
  showInlinePrompt: PropTypes.bool,
  dismissOnPanDown: PropTypes.bool,
  editorTitle: PropTypes.string,
  confirmationTitle: PropTypes.string,
};

export default AddCommentInput;
