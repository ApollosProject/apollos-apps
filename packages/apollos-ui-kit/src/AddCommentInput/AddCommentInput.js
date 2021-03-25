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
  openBottomSheetOnMount = true,
  showInlinePrompt = true,
  dismissOnPanDown = false,
  onSubmit,
  profile,
}) => {
  const safeArea = useSafeAreaInsets();
  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1);

  // todo: when we have useTheme() replace this
  const snapPoints = useMemo(
    () => [48 + 16 + (safeArea.bottom || 16), '100%'],
    [safeArea.bottom]
  );
  const bottomSheetModalRef = useRef(null);

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

  return (
    <>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleEditorChange}
        topInset={safeArea.top}
        animateOnMount
        // keyboardBehavior={'fullScreen'}
        dismissOnPanDown={dismissOnPanDown}
        backgroundComponent={(props) => <ModalBackgroundView {...props} />} // eslint-disable-line react/jsx-props-no-spreading
      >
        <Navigator
          onSubmit={onSubmit}
          profile={profile}
          prompt={prompt}
          bottomSheetModalRef={bottomSheetModalRef}
          bottomSheetIndex={bottomSheetIndex}
          editorTitle={editorTitle}
          confirmationTitle={confirmationTitle}
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
