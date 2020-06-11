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
  ButtonText,
  PaddedView,
  styled,
  withIsLoading,
  withTheme,
} from '@apollosproject/ui-kit';

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

const PrimaryButton = withTheme(
  () => ({}),
  'ui-prayer.PrayerScreen.PrimaryButton'
)(Button);

const SecondaryAction = styled({})(ButtonText);

const SecondaryActionWrapper = styled(
  {
    flexDirection: 'row',
  },
  'ui-prayer.PrayerScreen.SecondaryActionWrapper'
)(PaddedView);

const SecondaryActionIcon = withTheme(
  ({ theme }) => ({
    name: 'info',
    fill: theme.colors.text.secondary,
  }),
  'ui-prayer.PrayerScreen.SecondaryActionIcon'
)(Icon);

const PrayerScreen = ({
  buttonDisabled,
  children,
  isLoading,
  onPressBackground,
  onPressPrimary,
  onPressSecondary,
  primaryActionText,
  secondaryActionText,
}) => (
  <FlexedKeyboardAvoidingView behavior={'padding'}>
    <FlexedScrollView>
      <FlexedSafeAreaView>
        <FlexedTouchable onPress={onPressBackground}>
          <Content>{children}</Content>
        </FlexedTouchable>
        <PaddedView>
          {onPressSecondary ? (
            <SecondaryActionWrapper>
              <SecondaryAction onPress={onPressSecondary}>
                <SecondaryActionIcon />
                {secondaryActionText}
              </SecondaryAction>
            </SecondaryActionWrapper>
          ) : null}
          <PrimaryButton
            onPress={onPressPrimary}
            title={primaryActionText}
            isLoading={isLoading}
            disabled={buttonDisabled}
          />
        </PaddedView>
      </FlexedSafeAreaView>
    </FlexedScrollView>
  </FlexedKeyboardAvoidingView>
);

PrayerScreen.propTypes = {
  buttonDisabled: PropTypes.bool,
  children: PropTypes.node,
  isLoading: PropTypes.bool,
  onPressBackground: PropTypes.func,
  onPressPrimary: PropTypes.func,
  onPressSecondary: PropTypes.func,
  primaryActionText: PropTypes.string,
  secondaryActionText: PropTypes.string,
};

PrayerScreen.defaultProps = {
  onPressBackground: () => Keyboard.dismiss(),
  primaryActionText: 'Pray',
  secondaryActionText: 'How to Pray',
};

export default withIsLoading(PrayerScreen);
