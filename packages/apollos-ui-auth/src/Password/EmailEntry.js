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
  H5,
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
  LegalText,
} from '../styles';

const EmailEntry = ({
  alternateLoginText,
  authTitleText,
  disabled,
  errors,
  isLoading,
  onPressAlternateLogin,
  onPressNext,
  setFieldValue,
  emailPolicyInfo,
  emailPromptText,
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
            <TitleText>{authTitleText}</TitleText>
            <PromptText padded>{emailPromptText}</PromptText>

            {/* TODO: update to new design */}
            {onPressAlternateLogin ? (
              <PaddedView>
                <H5>
                  <ButtonLink onPress={onPressAlternateLogin}>
                    {alternateLoginText}
                  </ButtonLink>
                </H5>
              </PaddedView>
            ) : null}

            <H5>Email</H5>

            <TextInput
              autoFocus
              autoComplete={'email'}
              label={'Email'}
              type={'email'}
              enablesReturnKeyAutomatically
              returnKeyType={'next'}
              onSubmitEditing={onPressNext}
              error={get(errors, 'email')}
              onChangeText={(text) => setFieldValue('email', text)}
              value={get(values, 'email')}
            />
            <LegalText>{emailPolicyInfo}</LegalText>
          </PaddedView>
        </ScrollView>

        {onPressNext ? (
          <PaddedView>
            <NextButton
              title={'Next'}
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

EmailEntry.propTypes = {
  alternateLoginText: PropTypes.node,
  authTitleText: PropTypes.string,
  disabled: PropTypes.bool,
  errors: PropTypes.shape({
    phone: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
  onPressAlternateLogin: PropTypes.func,
  onPressNext: PropTypes.func, // used to navigate and/or submit the form
  setFieldValue: PropTypes.func.isRequired,
  emailPolicyInfo: PropTypes.string,
  emailPromptText: PropTypes.string,
  values: PropTypes.shape({
    phone: PropTypes.string,
  }),
  BackgroundComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

EmailEntry.defaultProps = {
  authTitleText: 'Have we met?',
  alternateLoginText: 'Phone',
  emailPolicyInfo: "You'll enter or create a password to continue.",
  emailPromptText:
    'Sign in for a personalized experience that helps you grow and connect with God.',
  BackgroundComponent: BackgroundView,
};

EmailEntry.LegalText = LegalText;

EmailEntry.displayName = 'EmailEntry';

export default EmailEntry;
