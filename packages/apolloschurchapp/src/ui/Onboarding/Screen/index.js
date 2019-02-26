import React, { memo } from 'react';
import PropTypes from 'prop-types';

import {
  styled,
  withTheme,
  FlexedView,
  PaddedView,
  H5,
  ButtonLink,
  Button,
  Icon,
} from '@apollosproject/ui-kit';

const NavWrapper = styled(({ theme }) => ({
  flexDirection: 'row-reverse', // reversed so the primary action is always on the right
  alignItems: 'center', // centers optional back button with dots/next button
  justifyContent: 'space-between',
  marginBottom: theme.sizing.baseUnit * 0.5, // centers nav/button with pager dots
}))(PaddedView);

const PrimaryNavIcon = withTheme(({ theme }) => ({
  size: theme.helpers.rem(1.25),
  style: {
    marginLeft: theme.sizing.baseUnit * 0.5,
    marginRight: theme.sizing.baseUnit * -0.5,
  },
}))(Icon);

const SkipButton = styled(({ theme }) => ({
  color: theme.colors.text.tertiary, // this is probably not the right color
  paddingVertical: theme.sizing.baseUnit * 0.9375, // optically centered on typographic baseline
  paddingHorizontal: theme.sizing.baseUnit, // improves tappability
  marginLeft: theme.sizing.baseUnit * -1, // adjusts for paddingHorizontal
}))(ButtonLink);

// memo = sfc PureComponent 💥
const Screen = memo(
  ({
    children,
    onboardingScrollBy,
    onboardingSkipTo,
    primaryNavText,
    primaryNavIcon,
    hidePrimaryNav,
    secondaryNavText,
  }) => (
    <>
      <FlexedView>
        <PaddedView>{children}</PaddedView>
      </FlexedView>
      {onboardingScrollBy ? (
        <NavWrapper vertical={false}>
          {!hidePrimaryNav ? (
            <Button onPress={() => onboardingScrollBy(1)}>
              <H5>{primaryNavText}</H5>
              <PrimaryNavIcon name={primaryNavIcon} />
            </Button>
          ) : null}
          {onboardingSkipTo ? (
            <SkipButton
              onPress={() =>
                onboardingScrollBy(
                  onboardingSkipTo,
                  false // don't animate the skip transition
                )
              }
            >
              {secondaryNavText}
            </SkipButton>
          ) : null}
        </NavWrapper>
      ) : null}
    </>
  )
);

Screen.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  onboardingScrollBy: PropTypes.func, // based by ref from react-native-swiper
  onboardingSkipTo: PropTypes.number, // shows a skip button and sets how far ahead to skip
  primaryNavText: PropTypes.string, // colored button text
  primaryNavIcon: PropTypes.string, // optional custom icon name
  hidePrimaryNav: PropTypes.bool, // optionally only show the secondary nav text
  secondaryNavText: PropTypes.string, // text link
};

Screen.defaultProps = {
  primaryNavText: 'Next',
  primaryNavIcon: 'arrow-next',
  secondaryNavText: 'Skip',
};

export default Screen;
