import React from 'react';
import { View } from 'react-native';
import {
  styled,
  withTheme,
  Icon,
  H2,
  H5,
  withIsLoading,
} from '@apollosproject/ui-kit';
import PropTypes from 'prop-types';

import { SafeAreaView } from 'react-navigation';

const IconWrapper = styled(
  ({ theme }) => ({
    paddingBottom: theme.sizing.baseUnit, // wrapper is used to padd placeholder as well.
  }),
  'ui-onboarding.Slide.SlideContent.IconWrapper'
)(View);

const BrandIcon = withTheme(
  ({ theme, icon }) => ({
    name: typeof icon === 'string' ? icon : 'brand-icon',
    fill: theme.colors.primary,
    size: theme.sizing.baseUnit * 3,
  }),
  'ui-onboarding.Slide.SlideContent.BrandIcon'
)(Icon);

const TitleWrapper = styled(
  ({ theme }) => ({
    paddingBottom: theme.sizing.baseUnit * 0.5, // wrapper is used to padd placeholder as well.
  }),
  'ui-onboarding.Slide.SlideContent.TitleWrapper'
)(View);

const Title = styled(
  ({ theme }) => ({
    color: theme.colors.primary,
  }),
  'ui-onboarding.Slide.SlideContent.Title'
)(H2);

const Description = styled(
  ({ theme }) => ({
    color: theme.colors.text.secondary,
  }),
  'ui-onboarding.Slide.SlideContent.Description'
)(H5);

const Wrapper = styled(
  ({ theme }) => ({
    paddingTop: theme.sizing.baseUnit,
    paddingHorizontal: theme.sizing.baseUnit,
    marginBottom: theme.sizing.baseUnit * 3,
  }),
  'ui-onboarding.Slide.SlideContent.Wrapper'
)(SafeAreaView);

const SlideContent = withIsLoading(
  ({ icon, title, description, children, isLoading, ...props }) => {
    if (!icon && !title && !description && !children) {
      console.warn(
        `Warning: You need to pass at least one prop for SlideContent to render something cowboy.`
      );
    }

    return (
      <Wrapper forceInset={{ bottom: 'always' }} {...props}>
        <View>
          {icon ? (
            <IconWrapper>
              <BrandIcon icon={icon} isLoading={isLoading} />
            </IconWrapper>
          ) : null}
          <TitleWrapper>
            <Title>{title}</Title>
          </TitleWrapper>
          <Description>{description}</Description>
        </View>
        {children}
      </Wrapper>
    );
  }
);

SlideContent.displayName = 'SlideContent';

SlideContent.propTypes = {
  icon: PropTypes.oneOfType([
    PropTypes.bool, // Use default `brand-icon`
    PropTypes.string, // Use a custom icon name
  ]),
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default SlideContent;
