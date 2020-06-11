import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import {
  Button,
  PaddedView,
  styled,
  withIsLoading,
  withTheme,
} from '@apollosproject/ui-kit';

const ButtonWithProps = withTheme(
  () => ({}),
  'ui-prayer.PrayerScreen.ButtonWithProps'
)(Button);

const Content = styled(
  {
    flexGrow: 1,
    justifyContent: 'center',
  },
  'ui-prayer.PrayerScreen.Content'
)(View);

const flexer = styled({ flex: 1 }); // 💪flex 💪all 💪the 💪things 💪bro

const FlexedKeyboardAvoidingView = flexer(KeyboardAvoidingView); // 💪💥
const FlexedSafeAreaView = flexer(SafeAreaView); // 💪💥
const FlexedTouchable = flexer(TouchableWithoutFeedback); // 💪💥

const FlexedScrollView = withTheme(
  () => ({
    contentContainerStyle: { flexGrow: 1 }, // using flexGrow here keeps the PrayerCard input above the keyboard as the input grows.
  }),
  'ui-prayer.PrayerScreen.FlexedScrollView'
)(ScrollView);

const PrayerScreen = ({
  buttonDisabled,
  primaryActionText,
  children,
  isLoading,
  onPressBackground,
  onPressPrimary,
}) => (
  <FlexedKeyboardAvoidingView behavior={'padding'}>
    <FlexedScrollView>
      <FlexedSafeAreaView>
        <FlexedTouchable onPress={onPressBackground}>
          <Content>{children}</Content>
        </FlexedTouchable>
        <PaddedView>
          <ButtonWithProps
            onPress={onPressPrimary}
            title={primaryActionText}
            isLoading={isLoading}
            disabled={buttonDisabled}
          />
        </PaddedView>
      </FlexedSafeAreaView>
    </FlexedScrollView>
  </FlexedKeyboardAvoidingView>
);

PrayerScreen.propTypes = {
  primaryActionText: PropTypes.string,
  buttonDisabled: PropTypes.bool,
  children: PropTypes.node,
  isLoading: PropTypes.bool,
  onPressBackground: PropTypes.func,
  onPressPrimary: PropTypes.func,
};

PrayerScreen.defaultProps = {
  primaryActionText: 'Pray',
  onPressBackground: () => Keyboard.dismiss(),
};

export default withIsLoading(PrayerScreen);
