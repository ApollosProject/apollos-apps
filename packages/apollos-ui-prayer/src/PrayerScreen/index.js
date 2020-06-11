import React from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

import {
  Button,
  H5,
  Icon,
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

const SecondaryActionButton = withTheme(
  () => ({
    type: 'default',
    bordered: true,
    style: { borderWidth: 0 },
  }),
  'ui-prayer.PrayerScreen.SecondaryActionButton'
)(Button);

const SecondaryActionIcon = withTheme(
  ({ theme }) => ({
    name: 'information',
    fill: theme.colors.text.secondary,
    size: theme.sizing.baseUnit * 1.5,
  }),
  'ui-prayer.PrayerScreen.SecondaryActionIcon'
)(Icon);

const PrayerScreen = ({
  buttonDisabled,
  children,
  isLoading,
  onPressPrimary,
  onPressSecondary,
  primaryActionText,
  secondaryActionText,
}) => (
  <FlexedKeyboardAvoidingView behavior={'padding'}>
    <FlexedScrollView
      keyboardShouldPersistTaps="never"
      keyboardDismissMode="on-drag"
    >
      <FlexedSafeAreaView>
        <Content>{children}</Content>
        <PaddedView>
          {onPressSecondary ? (
            <SecondaryActionButton onPress={onPressSecondary}>
              <SecondaryActionIcon />
              <H5> {secondaryActionText}</H5>
            </SecondaryActionButton>
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
  onPressPrimary: PropTypes.func,
  onPressSecondary: PropTypes.func,
  primaryActionText: PropTypes.string,
  secondaryActionText: PropTypes.string,
};

PrayerScreen.defaultProps = {
  primaryActionText: 'Pray',
  secondaryActionText: 'How to Pray',
};

export default withIsLoading(PrayerScreen);
