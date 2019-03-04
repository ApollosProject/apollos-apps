import React, { memo } from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';

import { styled, withTheme, Icon, H1, H4 } from '@apollosproject/ui-kit';

import Slide from '../../Slide';

const BrandIcon = withTheme(({ theme }) => ({
  name: 'brand-icon',
  size: theme.sizing.baseUnit * 3.0,
  fill: 'white',
  style: { marginBottom: theme.sizing.baseUnit * 0.5, marginTop: 200 },
}))(Icon);

const Title = styled(() => ({
  color: 'white',
  marginBottom: 40,
  marginTop: 20,
}))(H1);

const StyledH4 = styled(() => ({
  color: 'white',
}))(H4);

// TODO: get window size from ui-kit
const CoverImage = styled(() => ({
  resizeMode: 'cover',
  position: 'absolute',
  top: -50,
  flex: 1,
}))(Image);

const Launch = memo(({ slideTitle, description, ...props }) => (
  <Slide {...props}>
    <CoverImage source={require('./launch.jpg')} />
    <BrandIcon />
    <Title>{slideTitle.toUpperCase()}</Title>
    <StyledH4>{description}</StyledH4>
  </Slide>
));

Launch.propTypes = {
  /* The `Swiper` component used in `<Onboading>` looks for and hijacks the title prop of it's
   * children. Thus we have to use more unique name.
   */
  slideTitle: PropTypes.string,
  description: PropTypes.string,
};

Launch.defaultProps = {
  slideTitle: "We're glad you're here.",
  description:
    "We're not just a building you go to, but a family to belong to.",
};

export default Launch;
