import React from 'react';
import PropTypes from 'prop-types';
import { KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native';
import { get } from 'lodash';
import {
  Button,
  named,
  PaddedView,
  TextInput,
  styled,
  withTheme,
  Touchable,
  ButtonLink,
} from '@apollosproject/ui-kit';

import {
  FlexedSafeAreaView,
  LegalText,
  PromptText,
  TabButton,
  TabButtonText,
  TabButtonWrapper,
  TabCard,
  TabContainer,
  TabWrapper,
  TitleText,
  ButtonLinkText,
} from '../styles';

const StyledTextInput = withTheme(
  ({ theme }) => ({
    labelColor: theme.colors.text.tertiary,
  }),
  'ui-auth.StyledTextInput'
)(TextInput);

const FlexedKeyboardAvoidingView = styled({ flex: 1 })(KeyboardAvoidingView);

const IdentityEntry = ({
  authTitleText,
  disabled,
  errors,
  isLoading,
  onPressAlternateLogin,
  onPressNext,
  promptText,
  footerComponent,
  setFieldValue,
  values,
  inputAutoComplete,
  formType,
  newUser,
  onChangeNewUser,
}) => {
  const handleOnChangeText = (text) => setFieldValue(formType, text);

  const config = {
    email: {
      label: 'Email',
      inputType: 'email',
      policyInfo: "We'll email you a link to continue",
      inputAutoComplete: 'email',
    },
    phone: {
      label: 'Phone Number',
      inputType: 'phone',
      policyInfo: "We'll text you a code to continue",
      inputAutoComplete: 'tel',
    },
  };

  return (
    <FlexedSafeAreaView
      style={StyleSheet.absoluteFill}
      edges={['right', 'top', 'left', 'bottom']}
    >
      <FlexedKeyboardAvoidingView behavior={'padding'}>
        <ScrollView
          keyboardShouldPersistTaps="always"
          contentInsetAdjustmentBehavior={'automatic'}
        >
          <PaddedView>
            <TitleText>{authTitleText}</TitleText>
            <PromptText padded>{promptText}</PromptText>
            <TabWrapper>
              <TabContainer alternateLogin={formType === 'email'}>
                <TabButtonWrapper>
                  <Touchable>
                    <TabButton isActive>
                      <TabButtonText isActive>
                        {config[formType].label}
                      </TabButtonText>
                    </TabButton>
                  </Touchable>
                </TabButtonWrapper>

                {onPressAlternateLogin ? (
                  <TabButtonWrapper>
                    <Touchable onPress={onPressAlternateLogin}>
                      <TabButton>
                        <TabButtonText>
                          {
                            config[formType === 'phone' ? 'email' : 'phone']
                              .label
                          }
                        </TabButtonText>
                      </TabButton>
                    </Touchable>
                  </TabButtonWrapper>
                ) : null}
              </TabContainer>
              <TabCard>
                <PaddedView>
                  <StyledTextInput
                    autoComplete={inputAutoComplete}
                    autoCapitalize="none"
                    autoFocus
                    enablesReturnKeyAutomatically
                    error={get(errors, formType)}
                    label={config[formType].label}
                    onChangeText={handleOnChangeText}
                    onSubmitEditing={onPressNext}
                    returnKeyType={'next'}
                    type={config[formType].inputType}
                    value={get(values, formType)}
                  />
                  <LegalText>{config[formType].policyInfo}</LegalText>
                  {newUser ? (
                    <LegalText>
                      Already have an account?{' '}
                      <ButtonLink onPress={() => onChangeNewUser(false)}>
                        <ButtonLinkText>Log in →</ButtonLinkText>
                      </ButtonLink>
                    </LegalText>
                  ) : (
                    <LegalText>
                      Having trouble?{' '}
                      <ButtonLink onPress={() => onChangeNewUser(true)}>
                        <ButtonLinkText>Create an account →</ButtonLinkText>
                      </ButtonLink>
                    </LegalText>
                  )}
                </PaddedView>
              </TabCard>
            </TabWrapper>
            {footerComponent ? (
              <PromptText padded>{footerComponent}</PromptText>
            ) : null}
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
  );
};

IdentityEntry.propTypes = {
  authTitleText: PropTypes.string,
  formType: PropTypes.string.isRequired,
  newUser: PropTypes.bool.isRequired,
  onChangeNewUser: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  errors: PropTypes.shape({
    phone: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
  onPressAlternateLogin: PropTypes.func,
  onPressNext: PropTypes.func, // used to navigate and/or submit the form
  setFieldValue: PropTypes.func.isRequired,
  promptText: PropTypes.string,
  footerComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  values: PropTypes.shape({
    phone: PropTypes.string,
  }),
  inputAutoComplete: PropTypes.string,
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      text: PropTypes.shape({ tertiary: PropTypes.string }),
    }),
  }),
};

IdentityEntry.defaultProps = {
  authTitleText: 'Have we met?',
  promptText:
    'Sign in for a personalized experience that helps you grow and connect with God.',
};

IdentityEntry.displayName = 'IdentityEntry';

export default named('ui-auth.IdentityEntry')(IdentityEntry);
