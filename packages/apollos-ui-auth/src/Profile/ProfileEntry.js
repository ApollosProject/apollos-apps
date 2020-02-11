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
import { PaddedView, TextInput, BackgroundView } from '@apollosproject/ui-kit';

import BackButton from '../BackButton';
import {
  FlexedSafeAreaView,
  NextButton,
  TitleText,
  PromptText,
  LegalText,
} from '../styles';

const ProfileEntry = ({
  profileTitleText,
  profilePromptText,
  disabled,
  errors,
  isLoading,
  onPressNext,
  setFieldValue,
  values,
  BackgroundComponent,
  onPressBack,
}) => {
  let LastNameInput = null;
  return (
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
              <TitleText>{profileTitleText}</TitleText>
              <PromptText padded>{profilePromptText}</PromptText>
              <TextInput
                name="firstName"
                label={'First Name'}
                type={'text'}
                textContentType={'givenName'} // ios autofill
                returnKeyType={'next'}
                value={get(values, 'firstName')}
                error={get(errors, 'firstName', null)}
                onChangeText={(text) => setFieldValue('firstName', text)}
                onSubmitEditing={() => LastNameInput.focus()}
                disabled={isLoading}
                enablesReturnKeyAutomatically
              />
              <TextInput
                name="lastName"
                label={'Last Name'}
                type={'text'}
                textContentType={'familyName'} // ios autofill
                returnKeyType={'next'}
                value={get(values, 'lastName')}
                error={get(errors, 'lastName', null)}
                onChangeText={(text) => setFieldValue('lastName', text)}
                onSubmitEditing={onPressNext}
                disabled={isLoading}
                enablesReturnKeyAutomatically
                inputRef={(r) => {
                  LastNameInput = r;
                }}
              />
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
};

ProfileEntry.propTypes = {
  profileTitleText: PropTypes.node,
  profilePromptText: PropTypes.string,
  disabled: PropTypes.bool,
  errors: PropTypes.shape({
    phone: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
  onPressNext: PropTypes.func, // used to navigate and/or submit the form
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.shape({
    phone: PropTypes.string,
  }),
  BackgroundComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  onPressBack: PropTypes.func.isRequired,
};

ProfileEntry.defaultProps = {
  profileTitleText: 'Welcome!',
  profilePromptText:
    'Every relationship starts with a name. Complete your profile to help us connect with you.',
  BackgroundComponent: BackgroundView,
};

ProfileEntry.LegalText = LegalText;

ProfileEntry.displayName = 'ProfileEntry';

export default ProfileEntry;
