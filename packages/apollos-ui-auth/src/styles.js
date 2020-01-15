import React from 'react';
import { Platform, View } from 'react-native';
import { compose, withProps } from 'recompose';
import { SafeAreaView } from 'react-navigation';
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
  styled({ height: '100%' }, 'ui-auth.FlexedSafeAreaView'),
  withProps({ forceInset: { top: 'always' } })
)(SafeAreaView);

const BrandIcon = withTheme(({ theme }) => ({
  name: 'brand-icon',
  size: theme.sizing.baseUnit * 3.0,
  fill: theme.colors.text.primary,
  marginBottom: theme.sizing.baseUnit,
}))(Icon);

const TitleText = styled(
  ({ theme }) => ({
    color: theme.colors.action.primary,
  }),
  'ui-auth.TitleText'
)(H2);

const PromptText = styled(
  ({ theme }) => ({
    color: theme.colors.text.primary,
    paddingBottom: theme.sizing.baseUnit * 1.5,
  }),
  'ui-auth.PromptText'
)(H5);

const LegalText = styled(
  ({ theme }) => ({
    color: theme.colors.text.tertiary,
    fontWeight: 'normal',
  }),
  'ui-auth.EmailEntry.LegalText'
)(H6);

const NextButton = styled(
  ({ theme }) => ({
    backgroundColor: theme.colors.action.primary,
    color: theme.colors.text.invert,
  }),
  'ui-auth.NextButton'
)((props) => <Button pill={false} {...props} />);

// Tab Login

const TabWrapper = styled(
  ({ theme }) => ({
    marginHorizontal: 0,
    marginVertical: 0,
    ...Platform.select(theme.shadows.default),
  }),
  'ui-auth.TabWrapper'
)(Card);

const TabContainer = styled(
  ({ alternateLogin }) => ({
    flexDirection: alternateLogin ? 'row-reverse' : 'row',
    flex: 1,
  }),
  'ui-auth.TabContainer'
)(View);

const TabButtonWrapper = styled({ width: '50%' }, 'ui-auth.TabButtonWrapper')(
  View
);

const TabButton = styled(
  ({ theme, isActive }) => ({
    alignItems: 'center',
    backgroundColor: isActive
      ? theme.colors.background.paper
      : theme.colors.background.screen,
    borderRadius: 0,
    borderWidth: 0,
    color: isActive ? theme.colors.text.primary : theme.colors.text.tertiary,
    flexDirection: 'row',
    fontSize: theme.helpers.rem(0.75),
    fontWeight: 'normal',
    height: theme.sizing.baseUnit * 3,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: theme.sizing.baseUnit,

    ...Platform.select(theme.shadows.none),
  }),
  'ui-auth.TabButton'
)(View);

const TabCard = styled(
  ({ theme }) => ({
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingTop: 0,
    marginHorizontal: 0,
    marginVertical: 0,
    ...Platform.select(theme.shadows.none),
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
  TabButtonWrapper,
  TabWrapper,
};
