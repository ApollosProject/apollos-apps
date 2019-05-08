import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ScrollView } from 'react-native';

import { SafeAreaView } from 'react-navigation';

import {
  styled,
  withTheme,
  PaddedView,
  H5,
  ButtonLink,
  Button,
  Icon,
} from '@apollosproject/ui-kit';

const styles = StyleSheet.create({
  contentContainer: { minHeight: '100%' },
});

const forceInset = {
  top: 'never',
  bottom: 'always',
};

const NavWrapper = styled(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  flexDirection: 'row-reverse', // reversed so the primary action is always on the right
  alignItems: 'center', // centers optional back button with dots/next button
  justifyContent: 'space-between',
  marginVertical: theme.sizing.baseUnit * 0.5, // centers nav/button with pager dots
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

const FlexedScrollView = styled({ flex: 1 })(ScrollView);

/* Slide uses memo = sfc PureComponent 💥 Additionally, this component when rendered in a `Slider`
 * is automatically rendered in a `View` */
// eslint-disable-next-line react/display-name
const Slide = memo(
  ({
    children,
    onPressPrimary,
    onPressSecondary,
    primaryNavText,
    primaryNavIcon,
    secondaryNavText,
    isLoading,
    ...scrollViewProps
  }) => (
    <>
      <FlexedScrollView
        contentContainerStyle={styles.contentContainer}
        overScrollMode={'auto'}
        {...scrollViewProps}
      >
        {children}
      </FlexedScrollView>
      {onPressPrimary || onPressSecondary ? (
        <NavWrapper vertical={false}>
          <SafeAreaView forceInset={forceInset}>
            {onPressPrimary ? (
              <Button onPress={onPressPrimary} loading={isLoading}>
                <>
                  <H5>{primaryNavText}</H5>
                  {primaryNavIcon ? (
                    <PrimaryNavIcon name={primaryNavIcon} />
                  ) : null}
                </>
              </Button>
            ) : null}
            {onPressSecondary ? (
              <SkipButton onPress={onPressSecondary}>
                {secondaryNavText}
              </SkipButton>
            ) : null}
          </SafeAreaView>
        </NavWrapper>
      ) : null}
    </>
  )
);

Slide.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  onPressPrimary: PropTypes.func,
  onPressSecondary: PropTypes.func,
  primaryNavText: PropTypes.string, // colored button text
  primaryNavIcon: PropTypes.string, // optional custom icon name or empty string for no icon at all
  secondaryNavText: PropTypes.string, // text link
  isLoading: PropTypes.bool,
};

Slide.defaultProps = {
  primaryNavText: 'Next',
  primaryNavIcon: 'arrow-next',
  secondaryNavText: 'Skip',
};

export default Slide;
