import React from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

import {
  Button,
  H5,
  PaddedView,
  styled,
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

const PrimaryActionButton = withTheme(
  () => ({}),
  'ui-prayer.PrayerScreen.PrimaryActionButton'
)(Button);

const SecondaryActionButton = withTheme(
  () => ({
    type: 'default',
    bordered: true,
    style: {
      borderWidth: 0,
      // alignSelf: 'center', // these styles are unused but needed if you wanted to render the buttons loading state correctly. leaving these for reference.
      // ...(isLoading ? { marginBottom: theme.sizing.baseUnit * 0.5 } : {}),
    },
  }),
  'ui-prayer.PrayerScreen.SecondaryActionButton'
)(Button);

const PrayerScreen = ({
  buttonDisabled,
  background,
  children,
  isLoading,
  onPressPrimary,
  onPressSecondary,
  primaryActionText,
  secondaryActionText,
}) => (
  <FlexedKeyboardAvoidingView behavior={'padding'}>
    {background}
    <FlexedScrollView
      style={StyleSheet.absoluteFill}
      keyboardShouldPersistTaps={'never'}
      keyboardDismissMode={'on-drag'}
    >
      <FlexedSafeAreaView>
        <Content>{children}</Content>
        <PaddedView>
          {onPressSecondary ? (
            <SecondaryActionButton onPress={onPressSecondary}>
              <H5>{secondaryActionText}</H5>
            </SecondaryActionButton>
          ) : null}
          <PrimaryActionButton
            onPress={onPressPrimary}
            title={primaryActionText}
            loading={isLoading}
            isLoading={false}
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
  background: PropTypes.element,
};

PrayerScreen.defaultProps = {
  primaryActionText: '🙏 Pray',
  secondaryActionText: 'How to Pray',
};

export default PrayerScreen;
