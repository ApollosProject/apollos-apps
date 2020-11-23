/* eslint-disable */
import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import FlexedView from '../FlexedView';
import { H3, H6, BodyText } from '../typography';

import { ThemeProvider, ThemeMixin, withThemeMixin } from './';
import styled from '../styled'
import CenteredView from '../CenteredView'

const MixinPrimaryText = styled(({ theme: { colors: { primary } } }) => ({ color: primary }))(H3);
const MixinSecondaryText = styled(({ theme: { colors: { secondary } } }) => ({ color: secondary }))(H3);
const MixinTertiaryText = styled(({ theme: { colors: { tertiary } } }) => ({ color: tertiary }))(H3);


const newTheme = {
  colors: {
    primary: 'red',
    secondary: 'blue',
  }
}

storiesOf('ui-kit/mixin', module)
  .add('Mixins - default', () => (
    <ThemeProvider themeInput={newTheme}>
      <CenteredView>
        <MixinPrimaryText>
          I am primary! That means I'm red.
        </MixinPrimaryText>
        <MixinSecondaryText>
          I am secondary! That means I'm blue.
        </MixinSecondaryText>
        <MixinTertiaryText>
          I am tertiary! That means I'm inheriting my value from the core theme.
        </MixinTertiaryText>
      </CenteredView>
    </ThemeProvider>
  ))
  .add('Mixins - all three colors', () => (
    <ThemeProvider themeInput={newTheme}>
      <CenteredView>
        <ThemeMixin mixin={{ colors: { primary: 'salmon', secondary: 'yellow', tertiary: 'purple' } }}>
          <MixinPrimaryText>
            I am primary! That means I'm salmon.
          </MixinPrimaryText>
          <MixinSecondaryText>
            I am secondary! That means I'm yellow.
          </MixinSecondaryText>
          <MixinTertiaryText>
            I am tertiary! That means I'm purple.
          </MixinTertiaryText>
        </ThemeMixin>
      </CenteredView>
    </ThemeProvider>
  ))
  .add('Mixins - secondary null', () => (
    <ThemeProvider themeInput={newTheme}>
      <CenteredView>
        <ThemeMixin mixin={{ colors: { primary: 'salmon', secondary: null, tertiary: 'purple' } }}>
          <MixinPrimaryText>
            I am primary! That means I'm salmon.
          </MixinPrimaryText>
          <MixinSecondaryText>
            I am secondary! That means I'm blue (from theme input).
          </MixinSecondaryText>
          <MixinTertiaryText>
            I am tertiary! That means I'm purple.
          </MixinTertiaryText>
        </ThemeMixin>
      </CenteredView>
    </ThemeProvider>
  ))
  .add('Mixins - tertiary null', () => (
    <ThemeProvider themeInput={newTheme}>
      <CenteredView>
        <ThemeMixin mixin={{ colors: { primary: 'salmon', secondary: 'yellow', tertiary: null } }}>
          <MixinPrimaryText>
            I am primary! That means I'm salmon.
          </MixinPrimaryText>
          <MixinSecondaryText>
            I am secondary! That means I'm yellow.
          </MixinSecondaryText>
          <MixinTertiaryText>
            I am tertiary! That means I'm inheriting my value from the core theme.
          </MixinTertiaryText>
        </ThemeMixin>
      </CenteredView>
    </ThemeProvider>
  ));

