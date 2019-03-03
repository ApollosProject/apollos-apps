import React, { memo } from 'react';
import Image from 'react-native';
import PropTypes from 'prop-types';

import { styled, H2, H5, RadioButton, DateInput } from '@apollosproject/ui-kit';

import Slide from '../../Slide';

const Title = styled(({ theme }) => ({
  color: theme.colors.primary,
}))(H2);

const StyledH5 = styled(({ theme }) => ({
  color: theme.colors.text.secondary,
}))(H5);

const CoverImage = styled(() => ({
  width: '80%',
  height: '40%',
  marginTop: '30px',
}))(Image);

const AboutYou = memo(({ slideTitle, description, ...props }) => (
  <Slide {...props}>
    <CoverImage source={require('./mountain.jpeg')} />
    <Title>{slideTitle}</Title>
    <StyledH5>{description}</StyledH5>
    <RadioButton label="Gender">Male</RadioButton>
    <RadioButton label="Gender">Female</RadioButton>
    <DateInput label="Birthday" type="date" />
  </Slide>
));

AboutYou.propTypes = {
  /* The `Swiper` component used in `<Onboading>` looks for and hijacks the title prop of it's
   * children. Thus we have to use more unique name.
   */
  slideTitle: PropTypes.string,
  description: PropTypes.string,
};

AboutYou.defaultProps = {
  slideTitle: "This one's easy.",
  description:
    'Help us understand who you are so we can connect you with the best ministries and events.',
};

export default AboutYou;
