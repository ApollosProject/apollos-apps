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

const TextLimit = withTheme(({ length, maxLength, maxLengthWarning }) => ({
  ...(length >= maxLength - maxLengthWarning / 2
    ? {
        bold: true,
      }
    : {}),
}))(BodySmall);

const TextLimitWrapper = styled(({ theme }) => ({
  // position: 'absolute',
  // bottom: theme.sizing.baseUnit * 0.5,
  // right: theme.sizing.baseUnit,
  alignSelf: 'flex-end',
}))(View);

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

const PrayerPrompt = styled({
  alignItems: 'center',
  flexDirection: 'row',
})(View);

const PrayerInput = ({
  onBlur,
  onPress,
  maxLength,
  maxLengthWarning,
  prompt,
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
      <PrayerPrompt>
        <PlusIcon />
        <BodyText>{prompt}</BodyText>
      </PrayerPrompt>
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
      />
      {prayer.length >= maxLength - maxLengthWarning ? (
        <TextLimitWrapper>
          <TextLimit
            length={prayer.length}
            maxLength={maxLength}
            maxLengthWarning={maxLengthWarning}
          >
            {`${prayer.length}/${maxLength}`}
          </TextLimit>
        </TextLimitWrapper>
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
