import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import PropTypes from 'prop-types';

import {
  BodySmall,
  BodyText,
  Icon,
  styled,
  Touchable,
  withTheme,
} from '@apollosproject/ui-kit';

const TextLimit = withTheme(
  ({ length, maxLength, maxLengthWarning }) => ({
    ...(length >= maxLength - maxLengthWarning / 2
      ? {
          bold: true,
        }
      : {}),
  }),
  'ui-prayer.PrayerInput.TextLimit'
)(BodySmall);

const TextLimitPosition = styled(
  {
    alignSelf: 'flex-end',
  },
  'ui-prayer.PrayerInput.TextLimitPosition'
)(View);

const PlusIcon = withTheme(
  ({ theme }) => ({
    name: 'plus',
    size: theme.sizing.baseUnit * 1.5,
    style: {
      marginRight: theme.sizing.baseUnit * 0.5,
    },
  }),
  'ui-prayer.PrayerInput.PlusIcon'
)(Icon);

const Prompt = styled(
  {
    alignItems: 'center',
    flexDirection: 'row',
  },
  'ui-prayer.PrayerInput.Prompt'
)(View);

const PrayerInput = ({
  onBlur,
  onPress,
  maxLength,
  maxLengthWarning,
  prompt,
  ...TextInputProps
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [prayer, setPrayer] = useState('');

  // eslint-disable-next-line consistent-return
  const handleOnBlur = () => {
    if (!prayer && isEditing) {
      setIsEditing(false);

      return onBlur && onBlur({ isEditing: false, prayer });
    }
  };

  const handleOnPress = () => {
    setIsEditing(true);

    return onPress && onPress({ isEditing: true, prayer });
  };

  return !isEditing ? (
    <Touchable onPress={handleOnPress}>
      <Prompt>
        <PlusIcon />
        <BodyText>{prompt}</BodyText>
      </Prompt>
    </Touchable>
  ) : (
    <>
      <TextInput
        autoFocus
        maxLength={maxLength}
        multiline
        onBlur={handleOnBlur}
        onChangeText={(text) => setPrayer(text)}
        scrollEnabled={false}
        {...TextInputProps}
      />
      {prayer.length >= maxLength - maxLengthWarning ? (
        <TextLimitPosition>
          <TextLimit
            length={prayer.length}
            maxLength={maxLength}
            maxLengthWarning={maxLengthWarning}
          >
            {`${prayer.length}/${maxLength}`}
          </TextLimit>
        </TextLimitPosition>
      ) : null}
    </>
  );
};

PrayerInput.propTypes = {
  onBlur: PropTypes.func,
  onPress: PropTypes.func,
  maxLength: PropTypes.number,
  maxLengthWarning: PropTypes.number,
  prompt: PropTypes.string,
};

PrayerInput.defaultProps = {
  prompt: "I'm thankful for...",
  maxLength: 280,
  maxLengthWarning: 20,
};

export default PrayerInput;
