import React, { memo } from 'react';
import { Image, View } from 'react-native';
import PropTypes from 'prop-types';

import {
  styled,
  H2,
  H5,
  Radio,
  H6,
  DateInput,
  PaddedView,
} from '@apollosproject/ui-kit';

// import {RadioButton} from '@apollosproject/ui-kit/inputs/Radio';

import Slide from '../../Slide';

const Content = styled({
  flex: 1,
  justifyContent: 'center',
})(PaddedView);

const StyledImage = styled(({ theme }) => ({
  flex: 2,
  resizeMode: 'contain',
  marginBottom: theme.sizing.baseUnit * 2,
}))(Image);

const TextContent = styled({
  flex: 1,
  justifyContent: 'center',
})(View);

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

const StyledRadio = styled(({ theme }) => ({
  marginBottom: theme.sizing.baseUnit,
  flex: 1,
  flexDirection: 'row',
}))(Radio);

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
            <StyledRadio>
              <Radio.Button value={'Male'} Label={'Male'} />
              <Radio.Button value={'Female'} Label={'Female'} />
            </StyledRadio>
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
