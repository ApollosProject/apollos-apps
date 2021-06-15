import React from 'react';
import PropTypes from 'prop-types';

import {
  styled,
  withTheme,
  Icon,
  H1,
  H4,
  PaddedView,
  BackgroundView,
} from '@apollosproject/ui-kit';

import { Slide } from '@apollosproject/ui-onboarding';

const Content = styled({
  flex: 1,
  justifyContent: 'center',
})(PaddedView);

const BrandIcon = withTheme(
  ({ theme, color }) => ({
    name: 'brand-icon',
    size: theme.sizing.baseUnit * 3,
    ...(color ? { fill: color } : {}),
    style: {
      marginBottom: theme.sizing.baseUnit,
    },
  }),
  'ui-onboarding.Landing.BrandIcon'
)(Icon);

const Title = styled(
  ({ theme, color }) => ({
    marginBottom: theme.sizing.baseUnit,
    ...(color ? { color } : {}),
  }),
  'ui-onboarding.Landing.Title'
)(H1);

const Subtitle = styled(
  ({ color }) => ({
    ...(color ? { color } : {}),
  }),
  'ui-onboarding.Landing.Subtitle'
)(H4);

const LandingScreen = ({
  slideTitle,
  description,
  textColor,
  BackgroundComponent,
  onPressPrimary,
  primaryNavText,
}) => (
  <BackgroundView>
    <Slide
      onPressPrimary={onPressPrimary}
      primaryNavText={primaryNavText}
      scrollEnabled={false}
    >
      {BackgroundComponent}
      <Content>
        <BrandIcon color={textColor} />
        <Title color={textColor}>{slideTitle}</Title>
        <Subtitle color={textColor}>{description}</Subtitle>
      </Content>
    </Slide>
  </BackgroundView>
);

LandingScreen.propTypes = {
  /* The `Swiper` component used in `<onBoarding>` looks for and hijacks the title prop of it's
   * children. Thus we have to use more unique name.
   */
  slideTitle: PropTypes.string,
  description: PropTypes.string,
  textColor: PropTypes.string, // Use for custom text and `BrandIcon` color when overlaying text on an image or video needs more clarity. Defaults to theme driven colors.
  /* Recommended usage:
   * - `Image` (react-native)
   * - `GradientOverlayImage` (@apollosproject/ui-kit) for increased readability
   * - `Video` (react-native-video) because moving pictures!
   */
  BackgroundComponent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  onPressPrimary: PropTypes.func.isRequired,
  primaryNavText: PropTypes.string,
};

LandingScreen.defaultProps = {
  BackgroundComponent: null,
  slideTitle: "We're glad you're here.",
  description:
    "We're not just a building you go to, but a family to belong to.",
  primaryNavText: "Let's go!",
};

export default withTheme(
  ({ theme, textColor }) => ({
    textColor: textColor || theme.colors.primary,
  }),
  'ui-onboarding.Landing'
)(LandingScreen);
