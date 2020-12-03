
import React from 'react';
import renderer from 'react-test-renderer';

import { ThemeProvider } from './';

describe('ThemeProvider', () => {
  it('defaults to user settings', () => {
    const tree = renderer.create(
      <ThemeProvider>
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
  it('switches to light theme', () => {
    const tree = renderer.create(
      <ThemeProvider themeInput={{ type: 'light' }}>
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
  it('switches to dark theme', () => {
    const tree = renderer.create(
      <ThemeProvider themeInput={{ type: 'dark' }}>
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
});
