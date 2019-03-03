import React, { memo } from 'react';
import Image from 'react-native';
import PropTypes from 'prop-types';

import { styled, H2, H5 } from '@apollosproject/ui-kit';

import Slide from '../../Slide';

const Title = styled(({ theme }) => ({
  color: theme.colors.primary,
}))(H2);

const StyledH5 = styled(({ theme }) => ({
  color: theme.colors.text.secondary,
}))(H5);

const CoverImage = styled(() => ({
  width: '80%',
  height: '60%',
  marginTop: '30px',
}))(Image);

const Features = memo(({ slideTitle, description, ...props }) => (
  <Slide {...props}>
    <CoverImage source={require('./mountain.jpeg')} />
    <Title>{slideTitle}</Title>
    <StyledH5>{description}</StyledH5>
  </Slide>
));

Features.propTypes = {
  /* The `Swiper` component used in `<Onboading>` looks for and hijacks the title prop of it's
   * children. Thus we have to use more unique name.
   */
  slideTitle: PropTypes.string,
  description: PropTypes.string,
};

Features.defaultProps = {
  slideTitle: "We're glad you're here.",
  description:
    "We're not just a building you go to, but a family to belong to.",
};

export default Features;
