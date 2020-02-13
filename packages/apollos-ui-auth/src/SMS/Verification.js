import React from 'react';
import PropTypes from 'prop-types';
import {
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import { get } from 'lodash';

import {
  Button,
  PaddedView,
  TextInput,
  BackgroundView,
} from '@apollosproject/ui-kit';

import { FlexedSafeAreaView, TitleText, PromptText } from '../styles';
import BackButton from '../BackButton';

const Verification = ({
  confirmationTitleText,
  confirmationPromptText,
  disabled,
  errors,
  isLoading,
  onPressNext,
  onPressBack,
  setFieldValue,
  values,
  BackgroundComponent,
}) => (
  <KeyboardAvoidingView
    style={StyleSheet.absoluteFill}
    behavior={'padding'}
    keyboardVerticalOffset={
      Platform.OS === 'android' ? StatusBar.currentHeight : 0
    }
  >
    <BackgroundComponent>
      <FlexedSafeAreaView>
        <ScrollView>
          <BackButton onPress={() => onPressBack()} />
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
      </FlexedSafeAreaView>
    </BackgroundComponent>
  </KeyboardAvoidingView>
);

Verification.propTypes = {
  confirmationTitleText: PropTypes.string,
  confirmationPromptText: PropTypes.string,
  disabled: PropTypes.bool,
  errors: PropTypes.shape({
    code: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
  onPressNext: PropTypes.func,
  onPressBack: PropTypes.func,
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
  BackgroundComponent: BackgroundView,
};

export default Verification;
