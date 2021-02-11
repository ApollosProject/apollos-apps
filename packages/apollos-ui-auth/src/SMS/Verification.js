import React from 'react';
import PropTypes from 'prop-types';
import {
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { get } from 'lodash';

import {
  Button,
  PaddedView,
  TextInput,
  BackgroundView,
  styled,
} from '@apollosproject/ui-kit';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlexedSafeAreaView, TitleText, PromptText } from '../styles';

const FlexedKeyboardAvoidingView = styled({ flex: 1 })(KeyboardAvoidingView);

const FullScreenGradientBackground = styled(
  {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  'ui-auth.Entry.FullScreenGradientBackground'
)(BackgroundView);

const Verification = ({
  confirmationTitleText,
  confirmationPromptText,
  disabled,
  errors,
  isLoading,
  onPressNext,
  setFieldValue,
  values,
  BackgroundComponent,
}) => {
  // We need to  the avoiding view by by header height on iOS so the button doesn't appear under the keyboard.
  // https://github.com/software-mansion/react-native-screens/blob/bcd5e4d8ea861b78bff7747162e6df7163ed4e1f/createNativeStackNavigator/README.md
  const statusBarInset = useSafeAreaInsets().top; // inset of the status bar
  const headerInset = statusBarInset + 44; // inset to use for a small header since it's frame is equal to 44 + the frame of status bar
  return (
    <>
      {React.isValidElement(BackgroundComponent) ? (
        BackgroundComponent
      ) : (
        <BackgroundComponent />
      )}
      <FlexedSafeAreaView
        style={StyleSheet.absoluteFillObject}
        edges={['right', 'top', 'left']}
      >
        <FlexedKeyboardAvoidingView
          behavior={'padding'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? headerInset : 0}
        >
          <ScrollView>
            <PaddedView vertical={false}>
              <TitleText>{confirmationTitleText}</TitleText>
              <PromptText padded>{confirmationPromptText}</PromptText>

              <TextInput
                autoFocus
                label={'Verification Code'}
                type={'numeric'}
                autoComplete={'password'}
                enablesReturnKeyAutomatically
                returnKeyType={'next'}
                onSubmitEditing={onPressNext}
                error={get(errors, 'code')}
                onChangeText={(text) => setFieldValue('code', text)}
                value={get(values, 'code')}
              />
            </PaddedView>
          </ScrollView>

          {onPressNext ? (
            <PaddedView>
              <Button
                onPress={onPressNext}
                disabled={disabled}
                loading={isLoading}
                title={'Next'}
                type={'primary'}
                pill={false}
              />
            </PaddedView>
          ) : null}
        </FlexedKeyboardAvoidingView>
      </FlexedSafeAreaView>
    </>
  );
};

Verification.propTypes = {
  confirmationTitleText: PropTypes.string,
  confirmationPromptText: PropTypes.string,
  disabled: PropTypes.bool,
  errors: PropTypes.shape({
    code: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
  onPressNext: PropTypes.func,
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.shape({
    code: PropTypes.string,
  }),
  BackgroundComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

Verification.defaultProps = {
  confirmationTitleText: 'Thanks!\nStand by…',
  confirmationPromptText:
    'We just sent you a code. Enter it below when it comes.',
  BackgroundComponent: <FullScreenGradientBackground />,
};

export default Verification;
