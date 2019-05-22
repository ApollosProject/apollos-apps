import React from 'react';
import {
  Button,
  withTheme,
  Icon,
  styled,
  PaddedView,
  H2,
  H5,
} from '@apollosproject/ui-kit';

export const BrandIcon = withTheme(({ theme }) => ({
  name: 'brand-icon',
  size: theme.sizing.baseUnit * 3.0,
  fill: theme.colors.primary,
  marginBottom: theme.sizing.baseUnit,
}))(Icon);

export const TitleText = styled(({ theme }) => ({
  color: theme.colors.primary,
}))(H2);

export const PromptText = styled(({ theme }) => ({
  color: theme.colors.text.secondary,
}))(H5);

const NextButtonIcon = withTheme(({ theme }) => ({
  size: theme.helpers.rem(1.25),
  style: {
    marginLeft: theme.sizing.baseUnit * 0.5,
    marginRight: theme.sizing.baseUnit * -0.5,
  },
  name: 'arrow-next',
}))(Icon);

export const NextButtonRow = styled({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
})(PaddedView);

export const NextButton = (props) => (
  <Button type="secondary" {...props}>
    <>
      <H5>Next</H5>
      <NextButtonIcon />
    </>
  </Button>
);
