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

import { Button, PaddedView, styled, withTheme } from '@apollosproject/ui-kit';

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

const Content = styled(
  {
    flexGrow: 1,
    justifyContent: 'center',
  },
  'ui-prayer.PrayerScreen.Content'
)(View);

const PrayerScreen = ({ buttonText, children, onPressButton }) => (
  <FlexedKeyboardAvoidingView behavior={'padding'}>
    <FlexedScrollView>
      <FlexedSafeAreaView>
        <FlexedTouchable onPress={() => Keyboard.dismiss()}>
          <Content>{children}</Content>
        </FlexedTouchable>
        <PaddedView>
          <Button onPress={() => onPressButton()} title={buttonText} />
        </PaddedView>
      </FlexedSafeAreaView>
    </FlexedScrollView>
  </FlexedKeyboardAvoidingView>
);

PrayerScreen.propTypes = {
  buttonText: PropTypes.string,
  children: PropTypes.node,
  onPressButton: PropTypes.func,
};

PrayerScreen.defaultProps = {
  buttonText: 'Pray',
};

export default PrayerScreen;
