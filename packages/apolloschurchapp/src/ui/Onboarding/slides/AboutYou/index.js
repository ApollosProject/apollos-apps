import React, { memo } from 'react';
import { Image, View, Text } from 'react-native';
import PropTypes from 'prop-types';

import {
  styled,
  H2,
  Button,
  H5,
  H6,
  DateInput,
  PaddedView,
} from '@apollosproject/ui-kit';

import Slide from '../../Slide';

const Title = styled(({ theme }) => ({
  color: theme.colors.primary,
  marginBottom: theme.sizing.baseUnit * 0.5,
}))(H2);

const StyledH5 = styled(({ theme }) => ({
  color: theme.colors.text.secondary,
  marginBottom: theme.sizing.baseUnit,
}))(H5);

const Label = styled({
  color: 'gray',
  opacity: 0.7,
})(H6);

const StyledDate = styled(({ theme }) => ({
  marginBottom: theme.sizing.baseUnit,
}))(DateInput);

const StyledImage = styled(({ theme }) => ({
  flex: 2,
  resizeMode: 'contain',
  marginBottom: theme.sizing.baseUnit * 2,
}))(Image);

const Content = styled({
  flex: 1,
  justifyContent: 'center',
})(PaddedView);

const TextContent = styled({
  flex: 1,
  justifyContent: 'center',
})(View);

const GenderButtons = styled(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.sizing.baseUnit,
}))(View);

const GenderButton = styled({
  flex: 1,
  backgroundColor: 'white',
  borderColor: 'gray',
  borderWidth: 0.5,
  height: 32,
})(Button);

const LeftButton = styled({
  borderBottomRightRadius: 0,
  borderTopRightRadius: 0,
  borderBottomLeftRadius: 10,
  borderTopLeftRadius: 10,
})(GenderButton);

const RightButton = styled({
  borderBottomLeftRadius: 0,
  borderTopLeftRadius: 0,
  borderBottomRightRadius: 10,
  borderTopRightRadius: 10,
})(GenderButton);

const AboutYou = memo(
  ({ imgSrc, slideTitle, description, birthday, gender, ...props }) => (
    <Slide {...props}>
      <Content>
        {imgSrc ? <StyledImage source={imgSrc} /> : null}
        <TextContent>
          <Title>{slideTitle}</Title>
          <StyledH5>{description}</StyledH5>
          <View>
            <Label>Gender</Label>
            <GenderButtons>
              <LeftButton>
                <Text>Male</Text>
              </LeftButton>
              <RightButton>
                <Text>Female</Text>
              </RightButton>
            </GenderButtons>
          </View>
          {/* TODO: getting some warning with this DateInput */}
          <View>
            <Label>Birthday</Label>
            {birthday ? (
              <StyledDate
                value={birthday}
                displayValue={`${birthday.getMonth() +
                  1}/${birthday.getDate()}/${birthday.getFullYear()}`}
              />
            ) : (
              <StyledDate placeholder={'Select a date...'} />
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
  imgSrc: PropTypes.string,
  birthday: PropTypes.instanceOf(Date),
  gender: PropTypes.oneOf('Male', 'Female'),
};

AboutYou.defaultProps = {
  slideTitle: "This one's easy.",
  description:
    'Help us understand who you are so we can connect you with the best ministries and events.',
};

export default AboutYou;
