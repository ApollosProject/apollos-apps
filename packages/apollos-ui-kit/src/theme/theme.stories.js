/* eslint-disable */
import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import FlexedView from '../FlexedView';
import { H3, H6, BodyText } from '../typography';

import { ThemeProvider, ThemeMixin, withThemeMixin } from './';
import styled from '../styled';

// Create flexed view that is theme aware
const FlexedViewWithBackground = styled(({ theme }) => ({
  backgroundColor: theme.colors.background.screen,
  })) 
(FlexedView);

const TypeExample = () => (
  <FlexedViewWithBackground>
    <H3>Hi there!</H3>
    <H6>Lorem ipsum dolor sit amet.</H6>
    <BodyText>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sodales
      sit amet ante eu lobortis. In vitae faucibus lectus, at interdum nibh.
      Fusce suscipit tincidunt justo, vitae cursus mi fermentum eget.
    </BodyText>
  </FlexedViewWithBackground>
);

const MixinPrimaryText = styled(({ theme: { colors: { primary } } }) => ({ backgroundColor: primary }))(H3);
const MixinSecondaryText = styled(({ theme: { colors: { secondary } } }) => ({ backgroundColor: secondary }))(H3);

const DarkTypeExample = withThemeMixin({
  type: 'dark',
})(TypeExample);

const TypeExampleWithProps = withThemeMixin(({ color, isLight = true }) => ({
  type: isLight ? 'light' : 'dark',
  colors: {
    primary: color,
  },
}))(TypeExample);

storiesOf('ui-kit/Theming', module)
  .add('ThemeProvider - default', () => (
    <ThemeProvider>
      <TypeExample />
    </ThemeProvider>
  ))
  .add('ThemeProvider - dark theme', () => (
    <ThemeProvider
      themeInput={{
        type: 'dark',
      }}
    >
      <TypeExample />
    </ThemeProvider>
  ))
  .add('ThemeProvider - light theme', () => (
    <ThemeProvider
      themeInput={{
        type: 'light',
      }}
    >
      <TypeExample />
    </ThemeProvider>
  ))
  .add('ThemeMixin', () => (
    <ThemeProvider>
      <FlexedView>
        <TypeExample />
        <ThemeMixin mixin={{ type: 'dark' }}>
          <TypeExample />
        </ThemeMixin>
      </FlexedView>
    </ThemeProvider>
  ))
  .add('withThemeMixin', () => (
    <ThemeProvider>
      <FlexedView>
        <TypeExample />
        <DarkTypeExample />
      </FlexedView>
    </ThemeProvider>
  ))
  .add('withThemeMixin using props', () => (
    <ThemeProvider>
      <FlexedView>
        <TypeExampleWithProps isLight color="red" />
        <TypeExampleWithProps isLight={false} color="blue" />
      </FlexedView>
    </ThemeProvider>
  ))
  .add('ThemeMixin stripping null values', () => (
    <ThemeProvider>
      <FlexedView>
        <ThemeMixin mixin={{ colors: { primary: 'red', secondary: null } }}>
          <MixinPrimaryText>I am red!</MixinPrimaryText>
          <MixinSecondaryText>I am secondary!</MixinSecondaryText>
        </ThemeMixin>
      </FlexedView>
    </ThemeProvider>
  ));;

