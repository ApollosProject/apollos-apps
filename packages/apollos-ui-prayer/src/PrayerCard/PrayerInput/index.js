import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import {
  BodyText,
  Icon,
  styled,
  Touchable,
  withTheme,
} from '@apollosproject/ui-kit';

const PrayerPrompt = styled({
  alignItems: 'center',
  flexDirection: 'row',
})(View);

const PlusIcon = withTheme(
  ({ theme }) => ({
    name: 'plus',
    size: theme.sizing.baseUnit * 1.5,
    style: {
      marginRight: theme.sizing.baseUnit * 0.5,
    },
  }),
  'ui-prayer.PrayerCard.PlusIcon'
)(Icon);

const PrayerInput = ({ prompt }) => (
  <Touchable>
    <PrayerPrompt>
      <PlusIcon />
      <BodyText>{prompt}</BodyText>
    </PrayerPrompt>
  </Touchable>
);

PrayerInput.propTypes = {
  prompt: PropTypes.string,
};

PrayerInput.defaultProps = {
  prompt: "I'm thankful for...",
};

export default PrayerInput;
