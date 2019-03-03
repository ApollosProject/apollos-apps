import React, { memo } from 'react';
import Image from 'react-native';
import PropTypes from 'prop-types';

import { styled, withTheme, Icon, H2, H5 } from '@apollosproject/ui-kit';

import Slide from '../../Slide';

const BrandIcon = withTheme(({ theme }) => ({
  name: 'brand-icon',
  size: theme.sizing.baseUnit * 3.0,
  fill: theme.colors.primary,
  style: { marginBottom: theme.sizing.baseUnit * 0.5 },
}))(Icon);

const Title = styled(({ theme }) => ({
  color: theme.colors.primary,
}))(H2);

const StyledH5 = styled(({ theme }) => ({
  color: theme.colors.text.secondary,
}))(H5);

const CoverImage = styled(() => ({
  resizeMode: 'cover',
}))(Image);

const Launch = memo(({ slideTitle, description, ...props }) => (
  <Slide {...props}>
    <CoverImage source={{ uri: './launch.png' }} />
    <BrandIcon />
    <Title>{slideTitle}</Title>
    <StyledH5>{description}</StyledH5>
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
