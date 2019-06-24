import React from 'react';
import { SafeAreaView } from 'react-navigation';
import { compose, withProps } from 'recompose';
import {
  styled,
  Button,
  withTheme,
  Icon,
  H2,
  H5,
} from '@apollosproject/ui-kit';

const FlexedSafeAreaView = compose(
  styled({ flex: 1 }, 'UIAuth.FlexedSafeAreaView'),
  withProps({ forceInset: { top: 'always' } })
)(SafeAreaView);

const BrandIcon = withTheme(({ theme }) => ({
  name: 'brand-icon',
  size: theme.sizing.baseUnit * 3.0,
  fill: theme.colors.primary,
  marginBottom: theme.sizing.baseUnit,
}))(Icon);

const TitleText = styled(
  ({ theme }) => ({
    color: theme.colors.primary,
  }),
  'UIAuth.TitleText'
)(H2);

const PromptText = styled(
  ({ theme }) => ({
    color: theme.colors.text.secondary,
  }),
  'UIAuth.PromptText'
)(H5);

const NextButton = styled({}, 'UIAuth.NextButton')((props) => (
  <Button type={'primary'} pill={false} {...props}>
    <H5>Next</H5>
  </Button>
));

export { FlexedSafeAreaView, BrandIcon, TitleText, PromptText, NextButton };
