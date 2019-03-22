import React, { memo } from 'react';
import { Image, View } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

import {
  styled,
  H2,
  H5,
  Radio,
  RadioButton,
  H6,
  DateInput,
  FlexedView,
  PaddedView,
} from '@apollosproject/ui-kit';

import Slide from '../../Slide';

const Content = styled({
  justifyContent: 'center',
})(FlexedView);

const StyledImage = styled(({ theme }) => ({
  flex: 2,
  resizeMode: 'contain',
  marginBottom: theme.sizing.baseUnit * 2,
}))(Image);

const TextContent = styled({
  flex: 1,
  justifyContent: 'center',
})(PaddedView);

const Title = styled(({ theme }) => ({
  color: theme.colors.primary,
  marginBottom: theme.sizing.baseUnit * 0.5,
}))(H2);

const Description = styled(({ theme }) => ({
  color: theme.colors.text.secondary,
  marginBottom: theme.sizing.baseUnit,
}))(H5);

const Label = styled({
  color: 'gray',
  opacity: 0.7,
})(H6);

const StyledDate = styled(({ theme }) => ({
  marginTop: 0,
  marginBottom: theme.sizing.baseUnit,
}))(DateInput);

const StyledRadio = styled(({ theme }) => ({
  marginBottom: theme.sizing.baseUnit,
  flexDirection: 'row',
}))(Radio);

const RadioLabel = styled(({ theme }) => ({
  marginLeft: theme.sizing.baseUnit * 0.5,
}))(H5);

const AboutYou = memo(
  ({
    imgSrc,
    slideTitle,
    description,
    defaultDate,
    userDOB,
    userGender,
    genderList,
    ...props
  }) => (
    <Slide {...props}>
      <Content>
        {imgSrc ? <StyledImage source={imgSrc} /> : null}
        <TextContent>
          <Title>{slideTitle}</Title>
          <Description>{description}</Description>
          <View>
            <Label>Gender</Label>
            <StyledRadio value={userGender}>
              {genderList.map((gender) => [
                <RadioButton
                  key={gender}
                  value={gender}
                  label={() => <RadioLabel>{gender}</RadioLabel>}
                  underline={false}
                />,
              ])}
            </StyledRadio>
          </View>
          {/* TODO: getting some warning with this DateInput */}
          <View>
            <Label>Birthday</Label>
            {userDOB ? (
              <StyledDate
                value={moment.utc(userDOB).toDate()}
                displayValue={moment.utc(userDOB).format('MM/DD/YYYY')}
              />
            ) : (
              <StyledDate
                placeholder={'Select a date...'}
                value={defaultDate}
              />
            )}
          </View>
        </TextContent>
      </Content>
    </Slide>
  )
);

AboutYou.propTypes = {
  /* The `Swiper` component used in `<Onboading>` looks for and hijacks the title prop of it's
   * children. Thus we have to use more unique name.
   */
  slideTitle: PropTypes.string,
  description: PropTypes.string,
  imgSrc: Image.propTypes,
  userDOB: PropTypes.instanceOf(Date),
  defaultDate: PropTypes.instanceOf(Date),
  userGender: PropTypes.string,
  genderList: PropTypes.arrayOf(PropTypes.number),
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
