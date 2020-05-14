import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
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

const PrayerInput = ({ prompt }) => {
  const [state, setState] = useState({
    isEditing: false,
  });

  const handleOnBlur = () => {
    if (!state.value && state.isEditing) {
      setState({ isEditing: false });
    }
  };

  return !state.isEditing ? (
    <Touchable onPress={() => setState({ isEditing: true })}>
      <PrayerPrompt>
        <PlusIcon />
        <BodyText>{prompt}</BodyText>
      </PrayerPrompt>
    </Touchable>
  ) : (
    <TextInput
      autoFocus
      multiline
      onBlur={handleOnBlur}
      onChangeText={(value) =>
        setState((prevState) => ({ ...prevState, value }))
      }
    />
  );
};

PrayerInput.propTypes = {
  prompt: PropTypes.string,
};

PrayerInput.defaultProps = {
  prompt: "I'm thankful for...",
};

export default PrayerInput;
