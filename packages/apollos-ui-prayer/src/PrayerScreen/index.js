import React from 'react';
import PropTypes from 'prop-types';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

import { CenteredView } from '@apollosproject/ui-kit';

const PrayerScreen = (
  { children } // eslint-disable-line react/prop-types
) => (
  <TouchableWithoutFeedback
    onPress={() => Keyboard.dismiss()}
    style={{ flex: 1 }} // eslint-disable-line react-native/no-inline-styles
  >
    <CenteredView
      style={{ alignItems: 'stretch', backgroundColor: 'salmon' }} // eslint-disable-line
    >
      {children}
    </CenteredView>
  </TouchableWithoutFeedback>
);

PrayerScreen.propTypes = {
  children: PropTypes.node,
};

export default PrayerScreen;
