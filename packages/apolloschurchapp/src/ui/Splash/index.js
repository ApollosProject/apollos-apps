import React, { memo } from 'react';
import { Image, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

import { styled, withTheme, Icon, H1, H4 } from '@apollosproject/ui-kit';

import Slide from '../Onboarding/Slide';

const BrandIcon = withTheme(({ theme }) => ({
  name: 'brand-icon',
  size: theme.sizing.baseUnit * 3.0,
  fill: 'white',
  style: { marginBottom: theme.sizing.baseUnit * 0.5, marginTop: 200 },
}))(Icon);

const Title = styled({
  color: 'white',
  marginBottom: 40,
  marginTop: 20,
})(H1);

const StyledH4 = styled({
  color: 'white',
})(H4);

const CoverImage = styled({
  position: 'absolute',
  marginTop: -50,
  width: Dimensions.get('window').width + 20,
  height: Dimensions.get('window').height + 20,
})(Image);

const Splash = memo(({ slideTitle, description, ...props }) => (
  <Slide {...props}>
    <CoverImage source={require('./img/splash.jpg')} />
    <BrandIcon />
    <Title>{slideTitle.toUpperCase()}</Title>
    <StyledH4>{description}</StyledH4>
  </Slide>
));

Splash.propTypes = {
  /* The `Swiper` component used in `<Onboading>` looks for and hijacks the title prop of it's
   * children. Thus we have to use more unique name.
   */
  slideTitle: PropTypes.string,
  description: PropTypes.string,
  imageUrl: PropTypes.string,
};

Splash.defaultProps = {
  slideTitle: "We're glad you're here.",
  description:
    "We're not just a building you go to, but a family to belong to.",
};

export default Splash;
