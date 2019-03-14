import React, { memo } from 'react';
import { Image, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

import {
  styled,
  withTheme,
  Icon,
  H1,
  H4,
  PaddedView,
} from '@apollosproject/ui-kit';

import Slide from '../Onboarding/Slide';

const BrandIcon = withTheme(({ theme, isLight }) => ({
  name: 'brand-icon',
  size: theme.sizing.baseUnit * 3.0,
  fill: isLight ? theme.colors.text.primary : theme.colors.white,
  style: {
    marginBottom: theme.sizing.baseUnit,
    marginTop: Dimensions.get('window').height * 0.2,
  },
}))(Icon);

const Title = styled(({ theme, isLight }) => ({
  color: isLight ? theme.colors.text.primary : theme.colors.white,
  marginBottom: theme.sizing.baseUnit * 2,
}))(H1);

const CoverImage = styled({
  position: 'absolute',
  marginTop: -50,
  width: Dimensions.get('window').width + 20,
  height: Dimensions.get('window').height + 20,
})(Image);

const StyledH4 = styled(({ theme, isLight }) => ({
  color: isLight ? theme.colors.text.primary : theme.colors.white,
}))(H4);

const Splash = memo(
  ({ slideTitle, description, imageUrl, isLight, ...props }) => (
    <Slide {...props}>
      {imageUrl ? <CoverImage source={imageUrl} /> : null}
      <PaddedView>
        <BrandIcon isLight={isLight} />
        <Title isLight={isLight}>{slideTitle.toUpperCase()}</Title>
        <StyledH4 isLight={isLight}>{description}</StyledH4>
      </PaddedView>
    </Slide>
  )
);

Splash.propTypes = {
  /* The `Swiper` component used in `<Onboading>` looks for and hijacks the title prop of it's
   * children. Thus we have to use more unique name.
   */
  slideTitle: PropTypes.string,
  description: PropTypes.string,
  imageUrl: PropTypes.string,
  isLight: PropTypes.boolean,
};

Splash.defaultProps = {
  slideTitle: "We're glad you're here.",
  description:
    "We're not just a building you go to, but a family to belong to.",
  isLight: true,
};

export default Splash;
