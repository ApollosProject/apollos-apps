/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { KeyboardAvoidingView, StyleSheet, ScrollView } from 'react-native';
import { get } from 'lodash';
import {
  styled,
  H6,
  PaddedView,
  TextInput,
  ButtonLink,
} from '@apollosproject/ui-kit';

import {
  FlexedSafeAreaView,
  NextButton,
  TitleText,
  PromptText,
  BrandIcon,
} from '../styles';

const LegalText = styled(({ theme }) => ({
  color: theme.colors.text.tertiary,
}))(H6);

const PhoneEntry = ({
  alternateLoginText,
  authTitleText,
  disabled,
  errors,
  isLoading,
  onPressAlternateLogin,
  onPressNext,
  setFieldValue,
  smsPolicyInfo,
  smsPromptText,
  values,
}) => (
  <KeyboardAvoidingView style={StyleSheet.absoluteFill} behavior={'padding'}>
    <FlexedSafeAreaView>
      <ScrollView>
        <PaddedView>
          <BrandIcon />
          <TitleText>{authTitleText}</TitleText>
          <PromptText padded>{smsPromptText}</PromptText>

          <TextInput
            autoFocus
            autoComplete={'tel'}
            label={'Mobile Number'}
            type={'phone'}
            enablesReturnKeyAutomatically
            returnKeyType={'next'}
            onSubmitEditing={onPressNext}
            error={get(errors, 'phone')}
            onChangeText={(text) => setFieldValue('phone', text)}
            value={get(values, 'phone')}
          />
          {smsPolicyInfo}
        </PaddedView>

        {onPressAlternateLogin ? (
          <PaddedView>
            <ButtonLink onPress={onPressAlternateLogin}>
              {alternateLoginText}
            </ButtonLink>
          </PaddedView>
        ) : null}
      </ScrollView>

      {onPressNext ? (
        <PaddedView>
          <NextButton
            onPress={onPressNext}
            disabled={disabled}
            loading={isLoading}
          />
        </PaddedView>
      ) : null}
    </FlexedSafeAreaView>
  </KeyboardAvoidingView>
);

PhoneEntry.propTypes = {
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
  smsPolicyInfo: PropTypes.node,
  smsPromptText: PropTypes.string,
  values: PropTypes.shape({
    phone: PropTypes.string,
  }),
};

PhoneEntry.defaultProps = {
  authTitleText: 'Have we met before?',
  alternateLoginText: "I'd rather use my email and a password",
  smsPolicyInfo: (
    <LegalText>
      {"We'll never share your information or contact you (unless you ask!)."}
    </LegalText>
  ),
  smsPromptText:
    "Let's get you signed in using your mobile number. We'll text you a code to make login super easy!",
};

PhoneEntry.displayName = 'PhoneEntry';

export default PhoneEntry;
