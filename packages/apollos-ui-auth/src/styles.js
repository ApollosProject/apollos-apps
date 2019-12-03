import React from 'react';
import { SafeAreaView } from 'react-navigation';
import { compose, withProps } from 'recompose';
import { View } from 'react-native';
import {
  styled,
  Button,
  withTheme,
  Icon,
  H2,
  H5,
  PaddedView,
  Touchable,
} from '@apollosproject/ui-kit';

const FlexedSafeAreaView = compose(
  styled({ flex: 1 }, 'ui-auth.FlexedSafeAreaView'),
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
  'ui-auth.TitleText'
)(H2);

const PromptText = styled(
  ({ theme }) => ({
    color: theme.colors.text.secondary,
  }),
  'ui-auth.PromptText'
)(H5);

const NextButton = styled({}, 'ui-auth.NextButton')((props) => (
  <Button type={'primary'} pill={false} {...props} />
));

const SuppressingView = styled(
  {
    flexDirection: 'row',
  },
  'ui-auth.SuppressingView'
)(View);

const BackButtonTouchable = withTheme(({ theme }) => ({
  borderRadius: theme.sizing.baseUnit,
}))(Touchable);

const BackButtonWrapper = styled(
  {
    flexDirection: 'row',
    alignItems: 'center',
  },
  'ui-auth.BackButtonWrapper'
)(PaddedView);

const BackButtonIcon = withTheme(({ theme }) => ({
  fill: theme.colors.action.secondary,
  size: theme.sizing.baseUnit * 1.5,
  style: {
    paddingRight: 0,
  },
}))(Icon);

export {
  FlexedSafeAreaView,
  BrandIcon,
  TitleText,
  PromptText,
  SuppressingView,
  BackButtonTouchable,
  BackButtonWrapper,
  BackButtonIcon,
  NextButton,
};
