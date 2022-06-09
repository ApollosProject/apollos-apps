import React from 'react';
import { KeyboardAvoidingView, ScrollView, View, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  'ui-prayer.PrayerView.Content'
)(View);

const flexer = styled({ flex: 1 }, 'ui-prayer.PrayerView.flexer'); // 💪flex 💪all 💪the 💪things 💪bro

const FlexedKeyboardAvoidingView = flexer(KeyboardAvoidingView); // 💪💥
const FlexedSafeAreaView = flexer(SafeAreaView); // 💪💥

const FlexedScrollView = withTheme(
  () => ({
    contentContainerStyle: { flexGrow: 1 }, // using flexGrow here keeps the PrayerCard input above the keyboard as the input grows.
  }),
  'ui-prayer.PrayerView.FlexedScrollView'
)(ScrollView);

export const PrimaryActionButton = withTheme(
  () => ({}),
  'ui-prayer.PrayerView.PrimaryActionButton'
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
  'ui-prayer.PrayerView.SecondaryActionButton'
)(Button);

const keyboardAvoidingBehavior = Platform.OS === 'ios' ? 'padding' : 'height';

const PrayerView = ({
  children,
  isLoading,
  onPressPrimary,
  onPressSecondary,
  primaryActionText,
  secondaryActionText,
}) => (
  <FlexedSafeAreaView>
    <FlexedKeyboardAvoidingView
      behavior={keyboardAvoidingBehavior}
      keyboardVerticalOffset={20}
    >
      <FlexedScrollView
        keyboardShouldPersistTaps={'never'}
        keyboardDismissMode={'on-drag'}
      >
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
            disabled={!onPressPrimary}
          />
        </PaddedView>
      </FlexedScrollView>
    </FlexedKeyboardAvoidingView>
  </FlexedSafeAreaView>
);

PrayerView.propTypes = {
  children: PropTypes.node,
  isLoading: PropTypes.bool,
  onPressPrimary: PropTypes.func,
  onPressSecondary: PropTypes.func,
  primaryActionText: PropTypes.string,
  secondaryActionText: PropTypes.string,
};

PrayerView.defaultProps = {
  primaryActionText: '🙏 Pray',
  secondaryActionText: 'How to Pray',
};

export default PrayerView;
