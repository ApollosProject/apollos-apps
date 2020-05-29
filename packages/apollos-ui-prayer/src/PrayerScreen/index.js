import React from 'react';
import PropTypes from 'prop-types';
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';

import { styled, withTheme } from '@apollosproject/ui-kit';

const FlexedKeyboardAvoidingView = styled({
  flex: 1,
})(KeyboardAvoidingView);

const FlexedScrollView = withTheme(() => ({
  contentContainerStyle: { flexGrow: 1, justifyContent: 'center' },
}))(ScrollView);

const FlexedTouchable = styled({ flex: 1 })(TouchableWithoutFeedback);

const PrayerScreen = ({ children }) => (
  <FlexedKeyboardAvoidingView behavior={'padding'}>
    <FlexedScrollView>
      <FlexedTouchable onPress={() => Keyboard.dismiss()}>
        {children}
      </FlexedTouchable>
    </FlexedScrollView>
  </FlexedKeyboardAvoidingView>
);

PrayerScreen.propTypes = {
  children: PropTypes.node,
};

export default PrayerScreen;
