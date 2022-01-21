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
} from './styles';

const StyledTextInput = withTheme(
  ({ theme }) => ({
    labelColor: theme.colors.text.tertiary,
  }),
  'ui-auth.StyledTextInput'
)(TextInput);

const FlexedKeyboardAvoidingView = styled({ flex: 1 })(KeyboardAvoidingView);

const Entry = ({
  alternateLoginText,
  authTitleText,
  disabled,
  errors,
  inputLabel,
  inputType,
  isLoading,
  onPressAlternateLogin,
  onPressNext,
  policyInfo,
  promptText,
  footerComponent,
  setFieldValue,
  tabTitle,
  values,
  inputAutoComplete,
  alternateLogin,
}) => {
  const handleOnChangeText = (text) => setFieldValue(inputType, text);

  return (
    <FlexedSafeAreaView
      style={StyleSheet.absoluteFillObject}
      edges={['right', 'top', 'left']}
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
              <TabContainer alternateLogin={alternateLogin}>
                <TabButtonWrapper>
                  <Touchable>
                    <TabButton isActive>
                      <TabButtonText isActive>{tabTitle}</TabButtonText>
                    </TabButton>
                  </Touchable>
                </TabButtonWrapper>

                {onPressAlternateLogin ? (
                  <TabButtonWrapper>
                    <Touchable onPress={onPressAlternateLogin}>
                      <TabButton>
                        <TabButtonText>{alternateLoginText}</TabButtonText>
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
                    error={get(errors, inputType)}
                    label={inputLabel}
                    onChangeText={handleOnChangeText}
                    onSubmitEditing={onPressNext}
                    returnKeyType={'next'}
                    type={inputType}
                    value={get(values, inputType)}
                  />
                  <LegalText>{policyInfo}</LegalText>
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

Entry.propTypes = {
  alternateLogin: PropTypes.bool,
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
  policyInfo: PropTypes.string,
  promptText: PropTypes.string,
  footerComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  values: PropTypes.shape({
    phone: PropTypes.string,
  }),
  tabTitle: PropTypes.string,
  inputType: PropTypes.string,
  inputLabel: PropTypes.string,
  inputAutoComplete: PropTypes.string,
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      text: PropTypes.shape({ tertiary: PropTypes.string }),
    }),
  }),
};

Entry.defaultProps = {
  authTitleText: 'Have we met?',
  promptText:
    'Sign in for a personalized experience that helps you grow and connect with God.',
  alternateLogin: false,
};

Entry.displayName = 'Entry';

export default named('ui-auth.Entry')(Entry);
