import React, { useCallback, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDerivedValue, runOnJS } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Platform, View } from 'react-native';
import { Text } from '../inputs';
import { withTheme } from '../theme';
import Avatar from '../Avatar';
import styled from '../styled';
import { H4 } from '../typography';
import useKeyboardHeight from './useKeyboardHeight';

const ContainerScrollView = styled(({ theme }) => ({
  backgroundColor: theme?.colors?.background?.paper,
}))(({ scrollViewRef, ...otherProps }) => (
  <BottomSheetScrollView ref={scrollViewRef} {...otherProps} /> // eslint-disable-line react/jsx-props-no-spreading
));

const CommentInputContainer = styled(
  ({ theme }) => ({
    flex: 1,
    paddingLeft: theme.sizing.baseUnit,
  }),
  'ui-kit.AddCommentInput.CommentInputContainer'
)(View);

const NextButton = styled(
  ({ theme: { colors } }) => ({
    color: colors.action.secondary,
  }),
  'ui-kit.AddCommentInput.NextButton'
)(H4);

const TextInput = withTheme(({ theme }) => ({
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
}))(Text);

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

const Editor = ({
  bottomSheetModalRef,
  navigation,
  headerTitle,
  image,
  prompt,
  bottomSheetIndex,
}) => {
  const [value, setValue] = useState(null);
  const keyboardHeight = useKeyboardHeight();

  const handleStartWriting = useCallback(() => {
    bottomSheetModalRef.current?.expand();
  }, [bottomSheetModalRef]);

  const handleStopWriting = useCallback(() => {
    if (!value?.length) bottomSheetModalRef.current?.collapse();
  }, [bottomSheetModalRef, value]);

  const headerRight = useMemo(
    // eslint-disable-next-line react/display-name
    () => () => (
      <NextButton
        onPress={() => navigation.navigate('Confirmation', { value })}
      >
        Next
      </NextButton>
    ),
    [navigation, value]
  );

  useEffect(() => {
    navigation.setOptions({
      headerShown: !!value?.length,
      ...(value?.length
        ? {
            title: headerTitle,
            headerRight,
          }
        : {}),
    });
  }, [value, headerRight, headerTitle, navigation]);

  useDerivedValue(() => {
    // hide header when compressed
    if (bottomSheetIndex.value <= 0) {
      runOnJS(navigation.setOptions)({ headerShown: false });
    } else if (value?.length) {
      runOnJS(navigation.setOptions)({ headerShown: true });
    }
  });

  const flex = useMemo(() => ({ flex: 1 }), []);

  return (
    <ContainerScrollView
      scrollEnabled={false}
      focusHook={useFocusEffect}
      contentContainerStyle={flex}
    >
      <CommentInputContainer>
        <TextInput
          prefix={<EditorAvatar source={image} />}
          label={prompt}
          multiline
          onChangeText={setValue}
          onFocus={handleStartWriting}
          onBlur={handleStopWriting}
          enablesReturnKeyAutomatically
          underline={false}
          returnKeyType={Platform.OS === 'ios' ? 'default' : 'none'}
          // TextInputComponent={BottomSheetTextInput}
        />
        <View
          style={{
            height: keyboardHeight,
          }}
        />
      </CommentInputContainer>
    </ContainerScrollView>
  );
};

Editor.propTypes = {
  bottomSheetModalRef: PropTypes.shape({
    current: PropTypes.shape({
      collapse: PropTypes.func,
      expand: PropTypes.func,
    }),
  }),
  image: PropTypes.shape({}),
  prompt: PropTypes.string,
  text: PropTypes.shape({
    value: PropTypes.string,
    setValue: PropTypes.func,
  }),
  headerTitle: PropTypes.string,
  bottomSheetIndex: PropTypes.shape({
    value: PropTypes.number,
  }),
};

export default Editor;
