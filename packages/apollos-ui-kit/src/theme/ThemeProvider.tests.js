import React from 'react';
import renderer from 'react-test-renderer';

import FlexedView from '../FlexedView';
import { H3 } from '../typography';

import styled from '../styled';
import { withThemeMixin } from './mixins';
import { ThemeProvider } from '.';

// Create flexed view that is theme aware
const FlexedViewWithBackground = styled(({ theme }) => ({
  backgroundColor: theme.colors.background.screen,
}))(FlexedView);

const ThemeExample = () => (
  <FlexedViewWithBackground>
    <H3>YOOO</H3>
  </FlexedViewWithBackground>
);

const LightThemeExample = withThemeMixin({
  type: 'light',
})(ThemeExample);

const DarkThemeExample = withThemeMixin({
  type: 'dark',
})(ThemeExample);

// Needed in order to set a return value of 'light' or 'dark'
const mockColorScheme = jest.fn();
jest.mock('react-native-appearance', () => ({
  useColorScheme: mockColorScheme,
}));

describe('ThemeProvider', () => {
  it('defaults to user settings', () => {
    const tree = renderer.create(
      <ThemeProvider>
        <ThemeExample />
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders in light theme', () => {
    mockColorScheme.mockImplementationOnce(() => 'light');
    const tree = renderer.create(
      <ThemeProvider>
        <LightThemeExample />
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders in dark theme', () => {
    mockColorScheme.mockImplementationOnce(() => 'dark');
    const tree = renderer.create(
      <ThemeProvider>
        <DarkThemeExample />
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
});
