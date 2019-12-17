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
  PaddedView,
  TextInput,
  ButtonLink,
  BackgroundView,
} from '@apollosproject/ui-kit';

import {
  FlexedSafeAreaView,
  NextButton,
  TitleText,
  PromptText,
  BrandIcon,
} from '../styles';

const PasswordEntry = ({
  passwordTitleText,
  passwordPromptText,
  handleForgotPassword,
  disabled,
  errors,
  isLoading,
  onPressNext,
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
          <PaddedView>
            <BrandIcon />
            <TitleText>{passwordTitleText}</TitleText>
            <PromptText padded>{passwordPromptText}</PromptText>

            <TextInput
              autoFocus
              autoComplete={'password'}
              label={'Password'}
              type={'password'}
              textContentType="password"
              enablesReturnKeyAutomatically
              returnKeyType={'next'}
              onSubmitEditing={onPressNext}
              error={get(errors, 'password')}
              onChangeText={(text) => setFieldValue('password', text)}
              value={get(values, 'password')}
            />

            {handleForgotPassword ? (
              <ButtonLink onPress={handleForgotPassword}>
                Forgot your password?
              </ButtonLink>
            ) : null}
          </PaddedView>
        </ScrollView>

        {onPressNext ? (
          <PaddedView>
            <NextButton
              title={'Login'}
              onPress={onPressNext}
              disabled={disabled}
              loading={isLoading}
            />
          </PaddedView>
        ) : null}
      </FlexedSafeAreaView>
    </BackgroundComponent>
  </KeyboardAvoidingView>
);

PasswordEntry.propTypes = {
  passwordTitleText: PropTypes.string,
  passwordPromptText: PropTypes.string,
  disabled: PropTypes.bool,
  handleForgotPassword: PropTypes.func,
  errors: PropTypes.shape({
    password: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
  onPressNext: PropTypes.func, // used to navigate and/or submit the form
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.shape({
    password: PropTypes.string,
  }),
  BackgroundComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

PasswordEntry.defaultProps = {
  passwordTitleText: 'Now for your password',
  passwordPromptText: 'Enter your password to continue.',
  BackgroundComponent: BackgroundView,
};

PasswordEntry.displayName = 'PasswordEntry';

export default PasswordEntry;
