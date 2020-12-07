
import React from 'react';
import { useColorScheme } from 'react-native-appearance';
import renderer from 'react-test-renderer';

import FlexedView from '../FlexedView';
import { H3 } from '../typography';

import { ThemeProvider } from './';

const themeExample = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const themeColor = isDarkMode ?
    themeInput.type === 'dark' :
    themeInput.type === 'light';
  return (
    <FlexedView>
      <H3 style={themeColor}>Hello there</H3>/>
    </FlexedView>
  )
}

const mockColorScheme = jest.fn()
jest.mock('react-native-appearance', () => ({
  useColorScheme: mockColorScheme,
}))

// recreate complex behavior such that multiple function calls produce different results
describe('ThemeProvider', () => {
  it('defaults to user settings', () => {
    const tree = renderer.create(
      <ThemeProvider>
        <themeExample />
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders in light theme', () => {
    mockColorScheme.mockImplementationOnce(() => 'light');
    const tree = renderer.create(
      <ThemeProvider>
        <themeExample />
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders in dark theme', () => {
    mockColorScheme.mockImplementationOnce(() => 'dark');
    const tree = renderer.create(
      <ThemeProvider>
        <themeExample />
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
});
