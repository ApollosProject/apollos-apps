import React, { useCallback, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Animated, {
  useDerivedValue,
  runOnJS,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Platform, View, Animated as RNAnimated } from 'react-native';
import { Text } from '../inputs';
import { withTheme } from '../theme';
import Avatar from '../Avatar';
import styled from '../styled';
import { H4 } from '../typography';
import PaddedView from '../PaddedView';
import Touchable from '../Touchable';
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
    paddingTop: Platform.OS === 'android' ? theme.sizing.baseUnit / 2 : 0,
    paddingBottom: theme.sizing.baseUnit,
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
  const keyboardHeight = useKeyboardHeight();
  const text = useSharedValue(null);
  const [isEditing, setIsEditing] = useState(false);
  const [headerShown, setHeaderShown] = useState(false);

  const handleStartWriting = useCallback(() => {
    setIsEditing(true);
    bottomSheetModalRef.current?.expand();
  }, [bottomSheetModalRef]);

  const handleStopWriting = useCallback(() => {
    setIsEditing(false);
    if (!text.value?.length) bottomSheetModalRef.current?.collapse();
  }, [bottomSheetModalRef, text]);

  const onSubmit = useCallback(
    () => navigation.navigate('Confirmation', { value: text.value }),
    [navigation, text]
  );

  const HeaderRight = useMemo(
    // eslint-disable-next-line react/display-name
    () => () => <NextButton onPress={onSubmit}>Next</NextButton>,
    [onSubmit]
  );

  useDerivedValue(() => {
    const textHasLength = text.value?.length > 0;

    // hide header when compressed
    runOnJS(setHeaderShown)(
      textHasLength && (isEditing || bottomSheetIndex > 0)
    );
  }, [isEditing, bottomSheetIndex, setHeaderShown, text]);

  useEffect(() => {
    // not working on android 😭
    // Has nothing to do with reanimated derivedvalue stuff, hiding and showing
    // the navigation header while the keyboard is visible is borked on the
    // react-native-screens side of things. Not sure why 🤔
    let shouldShowHeader = headerShown;
    if (Platform.OS === 'android') shouldShowHeader = false;

    navigation.setOptions({
      headerShown: shouldShowHeader,
      ...(shouldShowHeader
        ? {
            title: headerTitle,
            headerRight: HeaderRight,
          }
        : {}),
    });
  }, [navigation, headerShown, headerTitle, HeaderRight]);

  const androidHeaderOpacity = useDerivedValue(() =>
    withSpring(headerShown ? 1 : 0)
  );
  const androidHeaderStyles = useAnimatedStyle(() => ({
    position: 'absolute',
    top: 0,
    right: 0, // todo: replace with useTheme()
    opacity: androidHeaderOpacity.value,
  }));

  const flex = useMemo(() => ({ flex: 1 }), []);

  return (
    <ContainerScrollView
      scrollEnabled={false}
      focusHook={useFocusEffect}
      contentContainerStyle={flex}
    >
      <CommentInputContainer>
        <TextInput
          prefix={
            <Touchable onPress={() => bottomSheetModalRef.current?.expand()}>
              <EditorAvatar source={image} />
            </Touchable>
          }
          label={prompt}
          multiline
          onChangeText={(value) => {
            text.value = value;
          }}
          onFocus={handleStartWriting}
          onBlur={handleStopWriting}
          enablesReturnKeyAutomatically
          underline={false}
          returnKeyType={Platform.OS === 'ios' ? 'default' : 'none'}
          focusAnimation={
            headerShown || text.value ? new RNAnimated.Value(1) : undefined
          }
        />
        {keyboardHeight && Platform.OS === 'ios' ? (
          <View
            style={{
              height: keyboardHeight,
            }}
          />
        ) : null}
      </CommentInputContainer>

      {Platform.OS === 'android' ? (
        <Animated.View style={androidHeaderStyles}>
          <PaddedView vertical={false}>
            <HeaderRight />
          </PaddedView>
        </Animated.View>
      ) : null}
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
