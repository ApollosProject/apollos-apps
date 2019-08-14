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
  styled,
  H6,
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
} from '../styles';

const LegalText = styled(
  ({ theme }) => ({
    color: theme.colors.text.tertiary,
  }),
  'ui-auth.SMSPhoneEntry.LegalText'
)(H6);

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
            <LegalText>{smsPolicyInfo}</LegalText>
          </PaddedView>

          {onPressAlternateLogin ? (
            <PaddedView>
              <H5>
                <ButtonLink onPress={onPressAlternateLogin}>
                  {alternateLoginText}
                </ButtonLink>
              </H5>
            </PaddedView>
          ) : null}
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
  smsPolicyInfo: PropTypes.string,
  smsPromptText: PropTypes.string,
  values: PropTypes.shape({
    phone: PropTypes.string,
  }),
  BackgroundComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

PhoneEntry.defaultProps = {
  authTitleText: 'Have we met before?',
  alternateLoginText: "I'd rather use my email and a password",
  smsPolicyInfo:
    "We'll never share your information or contact you (unless you ask!).",
  smsPromptText:
    "Let's get you signed in using your mobile number. We'll text you a code to make login super easy!",
  BackgroundComponent: BackgroundView,
};

PhoneEntry.LegalText = LegalText;

PhoneEntry.displayName = 'PhoneEntry';

export default PhoneEntry;
