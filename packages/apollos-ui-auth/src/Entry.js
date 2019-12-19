import React from 'react';
import PropTypes from 'prop-types';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { get } from 'lodash';
import {
  GradientOverlayImage,
  PaddedView,
  TextInput,
  styled,
  withTheme,
} from '@apollosproject/ui-kit';

import {
  BrandIcon,
  FlexedSafeAreaView,
  LegalText,
  NextButton,
  PromptText,
  TabButton,
  TabCard,
  TabContainer,
  TitleText,
} from './styles';

const FullScreenImage = styled({
  resizeMode: 'cover',
  position: 'absolute',
})(GradientOverlayImage);

const Entry = ({
  BackgroundComponent,
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
  setFieldValue,
  tabTitle,
  theme,
  values,
  inputAutoComplete,
  alternateLogin,
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
          <PromptText padded>{promptText}</PromptText>

          <TabContainer alternateLogin={alternateLogin}>
            <TabButton
              paddingBottom={0}
              title={tabTitle}
              isActive
              pill={false}
            />
            {onPressAlternateLogin ? (
              <TabButton
                onPress={onPressAlternateLogin}
                title={alternateLoginText}
                pill={false}
                paddingBottom={0}
              />
            ) : null}
          </TabContainer>
          <TabCard alternateLogin={alternateLogin}>
            <PaddedView>
              <TextInput
                autoFocus
                autoComplete={inputAutoComplete}
                label={inputLabel}
                type={inputType}
                enablesReturnKeyAutomatically
                returnKeyType={'next'}
                onSubmitEditing={onPressNext}
                error={get(errors, inputType)}
                onChangeText={(text) => setFieldValue(inputType, text)}
                value={get(values, inputType)}
                labelColor={theme.colors.white}
              />
              <LegalText>{policyInfo}</LegalText>
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
  values: PropTypes.shape({
    phone: PropTypes.string,
  }),
  BackgroundComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  tabTitle: PropTypes.string,
  inputType: PropTypes.string,
  inputLabel: PropTypes.string,
  inputAutoComplete: PropTypes.string,
};

Entry.defaultProps = {
  authTitleText: 'Have we met?',
  promptText:
    'Sign in for a personalized experience that helps you grow and connect with God.',
  BackgroundComponent: FullScreenImage,
  alternateLogin: false,
};

Entry.displayName = 'Entry';

export default withTheme()(Entry);
