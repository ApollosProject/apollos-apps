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
import moment from 'moment';
import {
  PaddedView,
  BackgroundView,
  H6,
  H5,
  DateInput,
  RadioButton,
  Radio,
  styled,
} from '@apollosproject/ui-kit';

import BackButton from '../BackButton';
import {
  FlexedSafeAreaView,
  NextButton,
  TitleText,
  PromptText,
  LegalText,
} from '../styles';

const Label = styled(({ theme, padded }) => ({
  color: 'gray',
  opacity: 0.7,
  ...(padded ? { marginTop: theme.sizing.baseUnit } : {}),
}))(H6);

const StyledDate = styled(({ theme }) => ({
  marginTop: 0,
  marginBottom: theme.sizing.baseUnit,
}))(DateInput);

const StyledRadio = styled(({ theme }) => ({
  marginBottom: theme.sizing.baseUnit,
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'wrap',
}))(Radio);

const RadioLabel = styled(({ theme }) => ({
  marginLeft: theme.sizing.baseUnit * 0.5,
}))(H5);

const ProfileDetailsEntry = ({
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
  genderList,
  touched,
  defaultDate,
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
            <TitleText>{profileTitleText}</TitleText>
            <PromptText padded>{profilePromptText}</PromptText>
            <Label padded>Gender</Label>
            <StyledRadio
              label="Gender"
              type="radio"
              value={get(values, 'gender')}
              error={get(touched, 'gender') && get(errors, 'gender')}
              onChange={(value) => setFieldValue('gender', value)}
            >
              {genderList.map((gender) => [
                <RadioButton
                  key={gender}
                  value={gender}
                  label={() => <RadioLabel>{gender}</RadioLabel>}
                  underline={false}
                />,
              ])}
            </StyledRadio>
            <Label>Birthday</Label>
            <StyledDate
              type={'DateInput'}
              placeholder={'Select a date...'}
              value={moment(
                get(values, 'birthDate', defaultDate) || defaultDate
              ).toDate()}
              error={get(touched, 'birthDate') && get(errors, 'birthDate')}
              displayValue={
                // only show a birthday if we have one.
                get(values, 'birthDate', '') // DatePicker shows displayValue > placeholder > label in that order
                  ? moment(values.birthDate).format('MM/DD/YYYY')
                  : '' // Pass an empty string if we don't have a birthday to show the placeholder.
              }
              onChange={(value) => setFieldValue('birthDate', value)}
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

ProfileDetailsEntry.propTypes = {
  profileTitleText: PropTypes.node,
  profilePromptText: PropTypes.string,
  disabled: PropTypes.bool,
  errors: PropTypes.shape({
    phone: PropTypes.string,
  }),
  touched: PropTypes.shape({
    gender: PropTypes.bool,
  }),
  isLoading: PropTypes.bool,
  onPressNext: PropTypes.func, // used to navigate and/or submit the form
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.shape({
    phone: PropTypes.string,
  }),
  BackgroundComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  onPressBack: PropTypes.func.isRequired,
  genderList: PropTypes.arrayOf(PropTypes.string),
  defaultDate: PropTypes.instanceOf(Date),
};

ProfileDetailsEntry.defaultProps = {
  profileTitleText: "This one's easy.",
  profilePromptText:
    'Help us understand who you are so we can connect you with the best ministries and events.',
  BackgroundComponent: BackgroundView,
  genderList: ['Male', 'Female', 'Prefer not to reply'],
  defaultDate: new Date(),
};

ProfileDetailsEntry.LegalText = LegalText;

ProfileDetailsEntry.displayName = 'ProfileDetailsEntry';

export default ProfileDetailsEntry;
