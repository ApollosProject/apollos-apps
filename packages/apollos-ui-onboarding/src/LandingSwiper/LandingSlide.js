import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import {
  styled,
  PaddedView,
  H5,
  Button,
  withTheme,
} from '@apollosproject/ui-kit';
import LinearGradient from 'react-native-linear-gradient';
import Color from 'color';
import { SharedElement } from 'react-navigation-shared-element';

import PhoneOutline from './PhoneOutline';

const dotStyles = ({ theme }) => ({
  width: theme.sizing.baseUnit / 2,
  height: theme.sizing.baseUnit / 2,
  borderRadius: theme.sizing.baseUnit / 4,
  margin: theme.sizing.baseUnit / 4,
});

const PhoneContainer = styled(
  ({ theme }) => ({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: theme.sizing.baseUnit * 2,
  }),
  'ui-onboarding.LandingSwiper.LandingSlide.PhoneContainer'
)(View);

const ChildrenContainer = styled(
  () => ({ flex: 0.5 }),
  'ui-onboarding.LandingSwiper.LandingSlide.ChildrenContainer'
)(View);

const PhoneMask = withTheme(({ theme }) => ({
  style: StyleSheet.absoluteFill,
  colors: [
    Color(theme.colors.background.screen).alpha(0).toString(),
    Color(theme.colors.background.screen).alpha(0.25).toString(),
    theme.colors.background.screen,
  ],
}))(LinearGradient);

const DotContainer = styled(
  () => ({ flexDirection: 'row', justifyContent: 'center' }),
  'ui-onboarding.LandingSwiper.LandingSlide.DotContainer'
)(View);

const ButtonContainer = styled(
  () => ({ width: '100%' }),
  'ui-onboarding.LandingSwiper.LandingSlide.ButtonContainer'
)(View);

const PrimaryButton = styled(
  {},
  'ui-onboarding.LandingSwiper.LandingSlide.PrimaryButton'
)(Button);

const PaginationDot = styled(
  ({ theme }) => ({
    backgroundColor: theme.colors.background.system,
    ...dotStyles({ theme }),
  }),
  'ui-onboarding.LandingSwiper.PaginationDot'
)(View);

const PaginationDotActive = styled(
  ({ theme }) => ({
    backgroundColor: theme.colors.text.action,
    ...dotStyles({ theme }),
  }),
  'ui-onboarding.LandingSwiper.PaginationDotActive'
)(View);

const PositionedSharedElement = styled(({ location = 'top' }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top:
    // eslint-disable-next-line no-nested-ternary
    location === 'top'
      ? '15%'
      : // eslint-disable-next-line no-nested-ternary
      location === 'centered'
      ? '50%'
      : location === 'top-mid'
      ? '20%'
      : undefined,
  bottom: location === 'bottom' ? '5%' : undefined,
}))(SharedElement);

const LandingSlide = ({
  screenChildren,
  index,
  totalSlides,
  calloutChildren,
  calloutLocation,
  children,
  onContinue,
  primaryButtonText = 'Continue',
  secondaryButtonChildren,
}) => (
  <>
    <PhoneContainer>
      <PhoneOutline>{screenChildren}</PhoneOutline>
      <SharedElement id="phone-mask" style={StyleSheet.absoluteFill}>
        <PhoneMask />
      </SharedElement>
      <PositionedSharedElement id="callout" location={calloutLocation}>
        {calloutChildren}
      </PositionedSharedElement>
    </PhoneContainer>
    <ChildrenContainer>{children}</ChildrenContainer>
    <SharedElement id="next-button">
      {Array.from(Array(totalSlides)).length > 1 ? (
        // Don't show the dot container if there is only one slide
        <DotContainer>
          {Array.from(Array(totalSlides)).map((_, i) =>
            i === index ? (
              // eslint-disable-next-line react/no-array-index-key
              <PaginationDotActive key={i} />
            ) : (
              // eslint-disable-next-line react/no-array-index-key
              <PaginationDot key={i} />
            )
          )}
        </DotContainer>
      ) : null}
      <ButtonContainer>
        <PaddedView>
          <PrimaryButton onPress={onContinue}>
            <H5>{primaryButtonText}</H5>
          </PrimaryButton>
          {secondaryButtonChildren}
        </PaddedView>
      </ButtonContainer>
    </SharedElement>
  </>
);

LandingSlide.propTypes = {
  screenChildren: PropTypes.node,
  index: PropTypes.number,
  totalSlides: PropTypes.number,
  calloutChildren: PropTypes.node,
  calloutLocation: PropTypes.oneOf(['top', 'top-mid', 'bottom', 'centered']),
  children: PropTypes.node,
  onContinue: PropTypes.func,
  primaryButtonText: PropTypes.string,
  secondaryButtonChildren: PropTypes.node,
};

export default LandingSlide;
