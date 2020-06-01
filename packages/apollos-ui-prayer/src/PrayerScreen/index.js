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

const PrayerScreen = ({ buttonText, children, isLoading, onPressButton }) => (
  <FlexedKeyboardAvoidingView behavior={'padding'}>
    <FlexedScrollView>
      <FlexedSafeAreaView>
        <FlexedTouchable onPress={() => Keyboard.dismiss()}>
          <Content>{children}</Content>
        </FlexedTouchable>
        <PaddedView>
          <ButtonWithProps
            onPress={onPressButton}
            title={buttonText}
            isLoading={isLoading}
          />
        </PaddedView>
      </FlexedSafeAreaView>
    </FlexedScrollView>
  </FlexedKeyboardAvoidingView>
);

PrayerScreen.propTypes = {
  buttonText: PropTypes.string,
  children: PropTypes.node,
  isLoading: PropTypes.bool,
  onPressButton: PropTypes.func,
};

PrayerScreen.defaultProps = {
  buttonText: 'Pray',
};

export default withIsLoading(PrayerScreen);
