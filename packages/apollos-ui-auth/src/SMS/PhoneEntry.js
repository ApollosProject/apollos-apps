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
  PaddedView,
  GradientOverlayImage,
  withTheme,
  TextInput,
} from '@apollosproject/ui-kit';

import {
  FlexedSafeAreaView,
  NextButton,
  TitleText,
  PromptText,
  LegalText,
  BrandIcon,
  TabCard,
  TabButton,
  TabContainer,
} from '../styles';

const FullScreenImage = styled({
  resizeMode: 'cover',
  position: 'absolute',
})(GradientOverlayImage);

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
  theme,
}) => (
  <KeyboardAvoidingView
    style={StyleSheet.absoluteFill}
    behavior={'padding'}
    keyboardVerticalOffset={
      Platform.OS === 'android' ? StatusBar.currentHeight : 0
    }
  >
    <BackgroundComponent
      source={'https://picsum.photos/375/812/?random'}
      overlayColor={theme.colors.primary}
      overlayType={'high'}
    />
    <FlexedSafeAreaView>
      <ScrollView>
        <PaddedView>
          <BrandIcon />
          <TitleText>{authTitleText}</TitleText>
          <PromptText padded>{smsPromptText}</PromptText>
          <PaddedView paddingBottom={0}>
            <TabContainer>
              <TabButton paddingBottom={0} title="Phone" active pill={false} />

              {onPressAlternateLogin ? (
                <TabButton
                  onPress={onPressAlternateLogin}
                  title={alternateLoginText}
                  pill={false}
                  paddingBottom={0}
                />
              ) : null}
            </TabContainer>
          </PaddedView>
          <TabCard>
            <PaddedView>
              <TextInput
                autoFocus
                autoComplete={'tel'}
                label={'Phone Number'}
                type={'phone'}
                enablesReturnKeyAutomatically
                returnKeyType={'next'}
                onSubmitEditing={onPressNext}
                error={get(errors, 'phone')}
                onChangeText={(text) => setFieldValue('phone', text)}
                value={get(values, 'phone')}
                labelColor={theme.colors.white}
              />
              <LegalText>{smsPolicyInfo}</LegalText>
            </PaddedView>
          </TabCard>
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
  authTitleText: 'Have we met?',
  alternateLoginText: 'Email',
  smsPolicyInfo: "We'll text you a code to make login super easy!",
  smsPromptText:
    'Sign in for a personalized experience that helps you grow and connect with God.',
  BackgroundComponent: FullScreenImage,
};

PhoneEntry.LegalText = LegalText;

PhoneEntry.displayName = 'PhoneEntry';

export default withTheme()(PhoneEntry);
