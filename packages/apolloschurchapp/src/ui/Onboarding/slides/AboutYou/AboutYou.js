import React, { memo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { get } from 'lodash';

import {
  styled,
  H5,
  Radio,
  RadioButton,
  H6,
  DateInput,
} from '@apollosproject/ui-kit';

import Slide, { SlideContent } from '../../Slide';

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

const AboutYou = memo(
  ({
    slideTitle,
    description,
    defaultDate,
    genderList,
    values,
    touched,
    errors,
    setFieldValue,
    BackgroundComponent,
    ...props
  }) => (
    <Slide {...props}>
      {BackgroundComponent}
      <SlideContent title={slideTitle} description={description}>
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
          value={moment
            .utc(get(values, 'birthDate', defaultDate) || defaultDate)
            .toDate()}
          error={get(touched, 'birthDate') && get(errors, 'birthDate')}
          displayValue={
            // only show a birthday if we have one.
            get(values, 'birthDate', '') // DatePicker shows displayValue > placeholder > label in that order
              ? moment(values.birthDate).format('MM/DD/YYYY')
              : '' // Pass an empty string if we don't have a birthday to show the placeholder.
          }
          onChange={(value) => setFieldValue('birthDate', value)}
        />
      </SlideContent>
    </Slide>
  )
);

AboutYou.propTypes = {
  /* The `Swiper` component used in `<Onboading>` looks for and hijacks the title prop of it's
   * children. Thus we have to use more unique name.
   */
  slideTitle: PropTypes.string,
  description: PropTypes.string,
  defaultDate: PropTypes.instanceOf(Date),
  genderList: PropTypes.arrayOf(PropTypes.string),
  values: PropTypes.shape({
    gender: PropTypes.bool,
    birthDate: PropTypes.bool,
  }),
  touched: PropTypes.shape({
    gender: PropTypes.string,
    birthDate: PropTypes.string,
  }),
  errors: PropTypes.shape({
    gender: PropTypes.string,
    birthDate: PropTypes.string,
  }),
  setFieldValue: PropTypes.func.isRequired,
  /* Recommended usage:
   * - `Image` (react-native)
   * - `GradientOverlayImage` (@apollosproject/ui-kit) for increased readability
   * - `Video` (react-native-video) because moving pictures!
   */
  BackgroundComponent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

AboutYou.defaultProps = {
  slideTitle: "This one's easy.",
  description:
    'Help us understand who you are so we can connect you with the best ministries and events.',
  genderList: ['Male', 'Female'],
  defaultDate: new Date(),
};

AboutYou.displayName = 'AboutYou';

export default AboutYou;
