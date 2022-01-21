import React from 'react';
import PropTypes from 'prop-types';
import { KeyboardAvoidingView, StyleSheet, ScrollView } from 'react-native';
import { get } from 'lodash';

import { Button, PaddedView, TextInput, styled } from '@apollosproject/ui-kit';

import { FlexedSafeAreaView, TitleText, PromptText } from '../styles';

const FlexedKeyboardAvoidingView = styled({ flex: 1 })(KeyboardAvoidingView);

const Verification = ({
  confirmationTitleText,
  confirmationPromptText,
  disabled,
  errors,
  isLoading,
  onPressNext,
  setFieldValue,
  values,
}) => {
  return (
    <FlexedSafeAreaView
      style={StyleSheet.absoluteFillObject}
      edges={['right', 'top', 'left', 'bottom']}
    >
      <FlexedKeyboardAvoidingView behavior={'padding'}>
        <ScrollView contentInsetAdjustmentBehavior={'automatic'}>
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
              title={'Verify'}
              type={'primary'}
              pill={false}
            />
          </PaddedView>
        ) : null}
      </FlexedKeyboardAvoidingView>
    </FlexedSafeAreaView>
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
};

Verification.defaultProps = {
  confirmationTitleText: 'Thanks!\nStand by…',
  confirmationPromptText:
    'We just sent you a code. Enter it below when it comes.',
};

export default Verification;
