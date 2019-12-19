import React from 'react';
import { Platform, SafeAreaView, View } from 'react-native';
import { compose, withProps } from 'recompose';
import {
  styled,
  Card,
  Button,
  withTheme,
  Icon,
  H2,
  H5,
  H6,
} from '@apollosproject/ui-kit';

const FlexedSafeAreaView = compose(
  styled({ flex: 1 }, 'ui-auth.FlexedSafeAreaView'),
  withProps({ forceInset: { top: 'always' } })
)(SafeAreaView);

const BrandIcon = withTheme(({ theme }) => ({
  name: 'brand-icon',
  size: theme.sizing.baseUnit * 3.0,
  fill: theme.colors.white,
  marginBottom: theme.sizing.baseUnit,
}))(Icon);

const TitleText = styled(
  ({ theme }) => ({
    color: theme.colors.white,
  }),
  'ui-auth.TitleText'
)(H2);

const PromptText = styled(
  ({ theme }) => ({
    color: theme.colors.white,
  }),
  'ui-auth.PromptText'
)(H5);

const LegalText = styled(
  ({ theme }) => ({
    color: theme.colors.white,
  }),
  'ui-auth.EmailEntry.LegalText'
)(H6);

const NextButton = styled(
  ({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    color: theme.colors.primary,
  }),
  'ui-auth.NextButton'
)((props) => <Button pill={false} {...props} />);

const TabContainer = styled(
  ({ alternateLogin }) => ({
    flexDirection: alternateLogin ? 'row-reverse' : 'row',
    justifyContent: alternateLogin ? 'flex-end' : 'flex-start',
  }),
  'ui-auth.TabContainer'
)(View);

const TabButton = styled(
  ({ theme, isActive }) => ({
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: isActive
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(255, 255, 255, 0)',
    color: theme.colors.white,
    borderWidth: 0,
    flex: 0,
  }),
  'ui-auth.TabButton'
)(Button);

const TabCard = styled(
  ({ theme, alternateLogin }) => ({
    borderTopLeftRadius: alternateLogin ? theme.sizing.baseBorderRadius : 0,
    paddingTop: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    ...Platform.select(theme.shadows.none),
    marginHorizontal: 0,
    marginVertical: 0,
  }),
  'ui-auth.TabCard'
)(Card);

export {
  FlexedSafeAreaView,
  BrandIcon,
  TitleText,
  PromptText,
  NextButton,
  LegalText,
  TabCard,
  TabButton,
  TabContainer,
};
