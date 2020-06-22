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

const Input = styled(({ theme }) => ({
  minHeight: theme.sizing.baseUnit * 3.25, // 🧙‍This magic numbers fixes jitter when you begin typing. At least one `baseUnit` is to ofset `paddingTop` on `Prompt`
  paddingVertical: 0, // fixes jitter when you begin typing on Android
}))(TextInput);

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

const PromptIcon = withTheme(
  ({ theme }) => ({
    name: 'circle-outline-plus',
    size: theme.sizing.baseUnit * 1.5,
    style: {
      marginRight: theme.sizing.baseUnit * 0.5,
    },
  }),
  'ui-prayer.PrayerInput.PromptIcon'
)(Icon);

const Prompt = styled(
  ({ theme }) => ({
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: theme.sizing.baseUnit,
    paddingBottom: theme.sizing.baseUnit * 0.625, // 🧙‍This magic numbers fixes jitter when you begin typing
  }),
  'ui-prayer.PrayerInput.Prompt'
)(View);

const PrayerInput = ({
  onBlur,
  onPress,
  maxLength,
  maxLengthWarning,
  prompt,
  onChangeText,
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

  const handleOnChangeText = (text) => {
    setPrayer(text);
    return onChangeText && onChangeText(text);
  };

  return !isEditing ? (
    <Touchable onPress={handleOnPress}>
      <Prompt>
        <PromptIcon />
        <BodyText>{prompt}</BodyText>
      </Prompt>
    </Touchable>
  ) : (
    <>
      <Input
        autoFocus
        maxLength={maxLength}
        multiline
        onBlur={handleOnBlur}
        onChangeText={handleOnChangeText}
        scrollEnabled={false}
        {...TextInputProps}
      >
        <BodyText>{prayer}</BodyText>
      </Input>
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
  onChangeText: PropTypes.func,
  onBlur: PropTypes.func,
  onPress: PropTypes.func,
  maxLength: PropTypes.number,
  maxLengthWarning: PropTypes.number, // triggers the "warning" to the user based on the number of characters remaining. `maxLength - maxLengthWarning = visual ui warning`
  prompt: PropTypes.string,
};

PrayerInput.defaultProps = {
  prompt: "I'm thankful for...",
  maxLength: 280,
  maxLengthWarning: 20,
};

export default PrayerInput;
