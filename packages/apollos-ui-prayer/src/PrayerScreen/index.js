import React from 'react';
import PropTypes from 'prop-types';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

import { CenteredView, styled } from '@apollosproject/ui-kit';

const FlexedTouchable = styled({ flex: 1 })(TouchableWithoutFeedback);

const Wrapper = styled({
  alignItem: 'stretch',
  backgroundColor: 'salmon',
})(CenteredView);

const PrayerScreen = (
  { children } // eslint-disable-line react/prop-types
) => (
  <FlexedTouchable onPress={() => Keyboard.dismiss()}>
    <Wrapper>{children}</Wrapper>
  </FlexedTouchable>
);

PrayerScreen.propTypes = {
  children: PropTypes.node,
};

export default PrayerScreen;
