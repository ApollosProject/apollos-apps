import React from 'react';
import PropTypes from 'prop-types';

import {
  styled,
  withTheme,
  BackgroundView,
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

const NextButtonIcon = withTheme(({ theme }) => ({
  name: 'arrow-next',
  size: theme.helpers.rem(1.25),
  style: {
    marginLeft: theme.sizing.baseUnit * 0.5,
    marginRight: theme.sizing.baseUnit * -0.5,
  },
}))(Icon);

const SkipButton = styled(({ theme }) => ({
  color: theme.colors.text.tertiary, // this is probably not the right color
}))(ButtonLink);

const Screen = ({ children, onboardingScrollBy, onboardingSkipTo }) => (
  <BackgroundView>
    <FlexedView>
      <PaddedView>{children}</PaddedView>
    </FlexedView>
    {onboardingScrollBy ? (
      <NavWrapper vertical={false}>
        <Button onPress={() => onboardingScrollBy(1)}>
          <H5>Next</H5>
          <NextButtonIcon />
        </Button>
        {onboardingSkipTo ? (
          <SkipButton
            onPress={() =>
              onboardingScrollBy(
                onboardingSkipTo,
                false // don't animate the skip transition
              )
            }
          >
            Skip
          </SkipButton>
        ) : null}
      </NavWrapper>
    ) : null}
  </BackgroundView>
);

Screen.propTypes = {
  children: PropTypes.node,
  onboardingScrollBy: PropTypes.func,
  onboardingSkipTo: PropTypes.number, // shows a skip button and defines how far ahead to skip
};

export default Screen;
