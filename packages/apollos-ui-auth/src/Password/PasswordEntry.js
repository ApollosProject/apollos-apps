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
  Button,
  ButtonLink,
  BackgroundView,
} from '@apollosproject/ui-kit';

import BackButton from '../BackButton';
import { FlexedSafeAreaView, TitleText, PromptText } from '../styles';

const PasswordEntry = ({
  passwordTitleText,
  passwordPromptText,
  passwordPromptTextNewUser,
  handleForgotPassword,
  disabled,
  errors,
  isLoading,
  onPressNext,
  setFieldValue,
  values,
  BackgroundComponent,
  newUser,
  onPressBack,
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
          <PaddedView>
            <TitleText>{passwordTitleText}</TitleText>
            <PromptText padded>
              {newUser ? passwordPromptTextNewUser : passwordPromptText}
            </PromptText>

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
            <Button
              onPress={onPressNext}
              disabled={disabled}
              loading={isLoading}
              title={'Login'}
              type={'primary'}
              pill={false}
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
  passwordPromptTextNewUser: PropTypes.string,
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
  newUser: PropTypes.bool,
  onPressBack: PropTypes.func.isRequired,
};

PasswordEntry.defaultProps = {
  passwordTitleText: 'Now for your password',
  passwordPromptText: 'Enter your password to continue.',
  passwordPromptTextNewUser: 'Create a new password to continue.',
  BackgroundComponent: BackgroundView,
};

PasswordEntry.displayName = 'PasswordEntry';

export default PasswordEntry;
